const usersRouter = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Obtener todos los usuarios con los blogs que han creado
usersRouter.get("/", async (request, response) => {
  try {
    const users = await User.find({}).populate("blogs", {
      title: 1,
      author: 1,
      url: 1,
    });
    response.json(users);
  } catch (error) {
    response.status(500).json({ error: "Failed to fetch users" });
  }
});

// Crear un nuevo usuario con contraseña cifrada
usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  // Validar que la contraseña sea válida
  if (!password || password.length < 3) {
    return response
      .status(400)
      .json({ error: "Password must be at least 3 characters long" });
  }

  try {
    // Cifrar la contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Crear un nuevo usuario
    const user = new User({
      username,
      name,
      passwordHash,
    });

    // Guardar el usuario en la base de datos
    const savedUser = await user.save();

    // Crear un token JWT
    const userForToken = {
      username: savedUser.username,
      id: savedUser._id,
    };

    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: 60 * 60, // 1 hora de expiración
    });

    response.status(201).json({
      token,
      username: savedUser.username,
      name: savedUser.name,
    });
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

// Ruta para iniciar sesión y obtener un token JWT
usersRouter.post("/login", async (request, response) => {
  const { username, password } = request.body;

  // Buscar al usuario en la base de datos
  const user = await User.findOne({ username });
  if (!user) {
    return response.status(401).json({ error: "invalid username or password" });
  }

  // Verificar la contraseña
  const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
  if (!passwordCorrect) {
    return response.status(401).json({ error: "invalid username or password" });
  }

  // Crear el token JWT
  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60, // 1 hora de expiración
  });

  response.status(200).send({
    token,
    username: user.username,
    name: user.name,
  });
});

module.exports = usersRouter;
