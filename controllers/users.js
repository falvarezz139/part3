const usersRouter = require("express").Router();
const bcrypt = require("bcryptjs");
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
    response.status(201).json(savedUser);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

module.exports = usersRouter;
