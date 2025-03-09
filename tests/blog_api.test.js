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
  assert.strictEqual(createdBlog.likes, 0);  // Verifica que likes es 0 
});

test("the first blog is about HTML", async () => {
  const response = await api.get("/api/blogs");
  const titles = response.body.map((e) => e.title);
  console.log(titles);
  assert(titles.includes("HTML is easy"));
});

test("there are two blogs", async () => {
  const response = await api.get("/api/blogs");
  assert.strictEqual(response.body.length, 2);
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "Async/Await simplifies making async calls",
    author: "John Doe",
    url: "http://example.com/async",
    likes: 5,
  };

  const response = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map((b) => b.title);
  assert(titles.includes("Async/Await simplifies making async calls"));

  const authors = blogsAtEnd.map((b) => b.author);
  assert(authors.includes("John Doe"));

  const urls = blogsAtEnd.map((b) => b.url);
  assert(urls.includes("http://example.com/async"));
});

test("blogs are returned as JSON and have the correct length", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test("the identifier of a blog is called 'id'", async () => {
  const response = await api.get("/api/blogs");
  const blog = response.body[0];
  assert(blog.id);
});

after(async () => {
  await mongoose.connection.close();
});