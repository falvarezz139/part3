const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user"); // Asegúrate de que esta ruta sea correcta

// Ruta para login
loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body;

  // Buscar al usuario en la base de datos
  const user = await User.findOne({ username });

  // Verificar la contraseña
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  // Crear el token con el id del usuario
  const userForToken = {
    username: user.username,
    id: user._id,
  };

  // Firmar el token con la clave secreta
  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: "1h" });

  // Devolver el token y el nombre del usuario
  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
