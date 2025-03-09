const { test, beforeEach, after } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const assert = require("assert");
const helper = require("./test_helper");
const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  // Crear un usuario de prueba
  const user = new User({
    username: "testuser",
    name: "Test User",
    passwordHash: "passwordHash", // Ajusta esto según la lógica de tu autenticación
  });

  await user.save();

  // Crear blogs relacionados con el usuario de prueba
  const blogObjects = helper.initialBlogs.map((blog) => new Blog({ ...blog, user: user._id }));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test("a blog's likes can be updated", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToUpdate = blogsAtStart[0];

  console.log("Antes de la actualización:", blogToUpdate.likes);  // Agregar para ver el valor

  const updatedData = {
    likes: blogToUpdate.likes + 1,
  };

  // Cambiar id a _id
  const response = await api
    .put(`/api/blogs/${blogToUpdate._id}`)
    .send(updatedData)
    .expect(200);

  // Verificar si likes está presente en la respuesta
  if (!response.body.likes) {
    throw new Error("No 'likes' field found in the response.");
  }

  console.log("Después de la actualización:", response.body.likes);  // Imprimir la respuesta

  assert.strictEqual(response.body.likes, blogToUpdate.likes + 1);

  const blogsAtEnd = await helper.blogsInDb();
  const updatedBlog = blogsAtEnd.find((b) => b._id.toString() === blogToUpdate._id.toString());
  if (!updatedBlog) {
    throw new Error("Updated blog not found in the database.");
  }
  assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 1);
});

test("returns 400 if likes value is not provided", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToUpdate = blogsAtStart[0];

  const updatedData = {};

  // Cambiar id a _id
  await api
    .put(`/api/blogs/${blogToUpdate._id}`)
    .send(updatedData)
    .expect(400);
});

after(async () => {
  await mongoose.connection.close();
});
