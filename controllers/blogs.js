const express = require("express");
const blogsRouter = express.Router(); // Aquí creas el Router
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken"); // Importa jwt

// Ahora puedes definir las rutas que utilizan blogsRouter

// Ruta para obtener todos los blogs
blogsRouter.get("/", async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate("user", {
      username: 1,
      name: 1,
    });
    response.json(blogs);
  } catch (error) {
    response.status(500).json({ error: "Failed to fetch blogs" });
  }
});

// Ruta para crear un blog
blogsRouter.post("/", async (request, response) => {
  const token = getTokenFrom(request); // Obtener token del request

  if (!token) {
    return response.status(401).json({ error: "token missing" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (!decodedToken.id) {
      return response.status(401).json({ error: "token invalid or expired" });
    }

    const user = await User.findById(decodedToken.id);

    if (!user) {
      return response.status(404).json({ error: "user not found" });
    }

    const blog = new Blog({
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes || 0,
      user: user._id,
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
  } catch (error) {
    response.status(500).json({ error: "internal server error" });
  }
});

// Función para extraer el token del encabezado Authorization
const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

module.exports = blogsRouter;
