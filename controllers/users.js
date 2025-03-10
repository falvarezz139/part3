const express = require("express");
const usersRouter = express.Router();
const User = require("../models/user");

//ruta para traernos todos los usuarios de cada blog
usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    content: 1,
    important: 1,
  }); //Poblamos los blogs del usuario
  response.json(users);
});

module.exports = usersRouter;
