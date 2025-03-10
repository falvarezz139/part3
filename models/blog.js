const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3, // Aseguramos que el título tenga al menos 3 caracteres
  },
  author: {
    type: String,
    minlength: 3, // Al menos 3 caracteres para el autor
  },
  url: {
    type: String,
    required: true,
    match: /https?:\/\/(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/, // Validación básica de URL
  },
  likes: {
    type: Number,
    default: 0,
    min: 0, // No puede ser un número negativo
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Relacionamos con el modelo de usuario
    required: true,
  },
});

// Establecer un índice en el campo `user` para mejorar las consultas
blogSchema.index({ user: 1 });

// Si necesitas incrementar o hacer algo específico con `likes`, puedes agregar un setter
blogSchema.path("likes").set((value) => Math.max(value, 0)); // Aseguramos que `likes` no sea negativo

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
