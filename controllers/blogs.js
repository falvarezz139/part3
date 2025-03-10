const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

// nos traemos todos los blogs del usuario
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

// filtramos por ID con información del usuario
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

// se crea un blog y se asocia con el usuario
blogsRouter.post("/", async (request, response) => {
  const { title, author, url, likes, userId } = request.body;

  if (!title || !url || !userId) {
    return response.status(400).json({
      error: "title, url, and userId are required",
    });
  }

  try {
    const user = await User.findById(userId); // filtramos al usuario por id
    if (!user) {
      return response.status(400).json({ error: "Invalid userId" });
    }

    const blog = new Blog({
      title,
      author,
      url,
      likes: likes || 0,
      user: user.id,
    });

    const savedBlog = await blog.save();

    user.blogs = user.blogs.concat(savedBlog._id); // Agregamos el blog al array de blogs del usuario
    await user.save();

    response.status(201).json(savedBlog);
  } catch (error) {
    response.status(400).json({ error: "Failed to save blog" });
  }
});

// Eliminar blog por ID
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

// Actualizar los megusta
blogsRouter.put("/:id", async (request, response, next) => {
  const { likes } = request.body;

  // Verificar si los megustas estan definidos y son numeros
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
    );
    response.json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
