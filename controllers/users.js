const express = require('express')
const usersRouter = express.Router()
const User = require('../models/user')

// Ruta para obtener todos los usuarios con sus blogs
usersRouter.get('/', async (request, response) => {
  const users = await User 
    .find({})
    .populate('blogs', { title: 1, content: 1, important: 1 })  // Poblar blogs del usuario
  response.json(users)
})

module.exports = usersRouter
