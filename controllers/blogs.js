const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

// Obtener todos los blogs con información del usuario creador
blogsRouter.get("/", async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate("user", {
      username: 1,
      name: 1,
    });
    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

// Obtener un blog por ID con información del usuario creador
blogsRouter.get("/:id", async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id).populate("user", {
      username: 1,
      name: 1,
    });

    if (blog) {
      response.json(blog);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    response.status(400).json({ error: "Invalid ID format" });
  }
});

// Crear un nuevo blog y asignar un usuario como creador
blogsRouter.post("/", async (request, response) => {
  const { title, author, url, likes, userId } = request.body;

  if (!title || !url) {
    return response.status(400).json({
      error: "title and url are required",
    });
  }

  try {
    let user;
    if (userId) {
      user = await User.findById(userId);
      if (!user) {
        return response.status(400).json({ error: "Invalid userId" });
      }
    } else {
      user = await User.findOne(); // Seleccionar un usuario aleatorio si no se proporciona userId
      if (!user) {
        return response
          .status(400)
          .json({ error: "No users found in database" });
      }
    }

    const blog = new Blog({
      title,
      author,
      url,
      likes: likes || 0,
      user: user.id,
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    // Devolver el blog con la info del usuario populada
    const populatedBlog = await Blog.findById(savedBlog._id).populate("user", {
      username: 1,
      name: 1,
    });

    response.status(201).json(populatedBlog);
  } catch (error) {
    response.status(400).json({ error: "Failed to save blog" });
  }
});

// Eliminar un blog por ID
blogsRouter.delete("/:id", async (request, response) => {
  try {
    const blog = await Blog.findByIdAndDelete(request.params.id);
    if (blog) {
      response.status(204).end();
    } else {
      response.status(404).json({ error: "Blog not found" });
    }
  } catch (error) {
    response.status(400).json({ error: "Invalid ID format" });
  }
});

// Actualizar los "me gusta" de un blog
blogsRouter.put("/:id", async (request, response, next) => {
  const { likes } = request.body;

  if (likes === undefined || typeof likes !== "number") {
    return response
      .status(400)
      .json({ error: "Likes value is required and must be a number" });
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { likes },
      { new: true }
    ).populate("user", {
      username: 1,
      name: 1,
    });

    response.json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
