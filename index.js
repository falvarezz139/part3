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
  req.method === "POST" || req.method === "PUT" ? JSON.stringify(req.body) : ""
);
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(cors());
app.use(express.static("dist"));

//Obtener todas las personas
app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => res.json(persons));
});

// Obtener persona por ID
app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => (person ? res.json(person) : res.status(404).end()))
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number)
    return res.status(400).json({ error: "Name and number are required" });

  Person.findOne({ name }).then((existingPerson) => {
    if (existingPerson) {
      // Si ya existe, actualiza el número
      Person.findByIdAndUpdate(
        existingPerson._id,
        { number },
        { new: true, runValidators: true }
      )
        .then((updatedPerson) => res.json(updatedPerson))
        .catch((error) => next(error));
    } else {
      // Si no existe la persona, la creamos
      const person = new Person({
        name,
        number,
      });

      person
        .save()
        .then((savedPerson) => res.json(savedPerson))
        .catch((error) => next(error));
    }
  });
});

app.put("/api/persons/:id", (req, res, next) => {
  const { number } = req.body;

  // Validación: Asegurarse de que 'number' esté presente
  if (!number) {
    return res.status(400).json({ error: "Number is required" });
  }

  // Actualizar número de teléfono
  Person.findByIdAndUpdate(
    req.params.id,
    { number },
    { new: true, runValidators: true }
  )
    .then((updatedPerson) => {
      updatedPerson
        ? res.json(updatedPerson)
        : res.status(404).json({ error: "Person not found" });
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((deletedPerson) => {
      deletedPerson
        ? res.status(204).end()
        : res.status(404).json({ error: "Person not found" });
    })
    .catch((error) => next(error));
});

// Manejo de endpoints desconocidos
app.use((req, res) => res.status(404).json({ error: "unknown endpoint" }));

//capturar errores de validacion
app.use((error, req, res, next) => {
  console.error(error.message);

  // Manejo de errores para IDs mal formateados
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }

  // Manejo de errores de validación (por ejemplo, campos obligatorios vacíos o número de teléfono no válido)
  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error); // Si el error no es un error de validación o CastError, lo pasa al siguiente middleware
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
