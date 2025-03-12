const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Ruta correcta a tu modelo User

const loginRouter = express.Router();

// Ruta para login
loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body;

  // Buscar al usuario en la base de datos
  const user = await User.findOne({ username });

  // Si el usuario no existe, devolver un error
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
    expiresIn: "1h", // El token expirará en 1 hora
  });

  // Enviar el token y el nombre del usuario como respuesta
  response.status(200).send({
    token,
    username: user.username,
    name: user.name,
  });
});

module.exports = loginRouter;
