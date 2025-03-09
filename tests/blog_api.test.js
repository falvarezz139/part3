const { test, beforeEach, after } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const assert = require("assert");
const helper = require("./test_helper");
const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test("if likes is missing, it will default to 0", async () => {
  const newBlog = {
    title: "Blog with no likes",
    author: "Jane Doe",
    url: "http://example.com/no-likes",
  };

  const response = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const createdBlog = response.body;
  assert.strictEqual(createdBlog.likes, 0);
});

test("blog without title or url is not added", async () => {
  const newBlog = {
    author: "John Doe",
    likes: 10,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
});

test("the first blog is about HTML", async () => {
  const response = await api.get("/api/blogs");
  const titles = response.body.map((e) => e.title);
  assert(titles.includes("HTML is easy"));
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "Async/Await simplifies making async calls",
    author: "John Doe",
    url: "http://example.com/async",
    likes: 5,
  };

  await api.post("/api/blogs").send(newBlog).expect(201);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);
});

test("blogs are returned as JSON and have the correct length", async () => {
  const response = await api.get("/api/blogs").expect(200);
  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test("the identifier of a blog is called 'id'", async () => {
  const response = await api.get("/api/blogs");
  const blog = response.body[0];
  assert(blog.id);
});

test("a blog can be deleted", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);

  const deletedBlog = blogsAtEnd.find((b) => b.id === blogToDelete.id);
  assert.strictEqual(deletedBlog, undefined);
});

test("returns 404 if blog not found", async () => {
  const nonExistentId = "60f5a2f28f49c2b1c0b8e830";
  await api
    .delete(`/api/blogs/${nonExistentId}`)
    .expect(404);
});

test("returns 400 for invalid ID", async () => {
  const invalidId = "invalidId";
  await api
    .delete(`/api/blogs/${invalidId}`)
    .expect(400);
});

after(async () => {
  await mongoose.connection.close();
});
