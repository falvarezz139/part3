const blogsRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");

// Middleware para extraer el token del encabezado Authorization
const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

// Obtener todos los blogs con información del usuario creador
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

// Crear un nuevo blog, solo si el usuario está autenticado
blogsRouter.post("/", async (request, response) => {
  const { title, author, url, likes } = request.body;

  // Extraer y verificar el token
  const token = getTokenFrom(request);
  if (!token) {
    return response.status(401).json({ error: "token missing" });
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.SECRET);
  } catch (error) {
    return response.status(401).json({ error: "invalid token" });
  }

  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  // Buscar al usuario autenticado en la base de datos
  const user = await User.findById(decodedToken.id);
  if (!user) {
    return response.status(401).json({ error: "user not found" });
  }

  // Crear un nuevo blog asociado al usuario autenticado
  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id, // Asignar el usuario autenticado como creador
  });

  // Guardar el blog en la base de datos
  const savedBlog = await blog.save();

  // Agregar el blog a la lista de blogs del usuario y guardar el usuario
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

module.exports = blogsRouter;
