require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const Person = require("./models/person");

const url = process.env.MONGODB_URI;
console.log("connecting to", url);

mongoose.set("strictQuery", false);
mongoose
  .connect(url)
  .then(() => console.log("connected to MongoDB"))
  .catch((error) => console.log("error connecting to MongoDB:", error.message));

const app = express();

morgan.token("body", (req) =>
  req.method === "POST" ? JSON.stringify(req.body) : ""
);
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(cors());
app.use(express.static("dist"));

// Obtener todas las personas
app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => res.json(persons));
});

// Obtener una persona por ID
app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => (person ? res.json(person) : res.status(404).end()))
    .catch((error) => next(error));
});

// Agregar una persona
app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;
  if (!name || !number)
    return res.status(400).json({ error: "Name and number are required" });

  const person = new Person({ name, number });
  person.save().then((savedPerson) => res.json(savedPerson));
});

// Eliminar una persona por ID
app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((deletedPerson) => {
      deletedPerson
        ? res.status(204).end()
        : res.status(404).json({ error: "Person not found" });
    })
    .catch((error) => next(error));
});

// Middleware para manejar endpoints desconocidos
app.use((req, res) => res.status(404).json({ error: "unknown endpoint" }));

// Middleware de manejo de errores
app.use((error, req, res, next) => {
  console.error(error.message);
  if (error.name === "CastError")
    return res.status(400).json({ error: "malformatted id" });
  next(error);
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
