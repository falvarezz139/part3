const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(express.json());

morgan.token("body", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : ""; //convierte la peticion en un string
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(cors());

app.use(express.static("dist"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  //trae los datos
  response.json(persons);
});

app.post("/api/persons", (request, response) => {
  //agrega persona nueva
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({ error: "Name and number are required" });
  }

  if (persons.some((p) => p.name === name)) {
    return response.status(400).json({ error: "Name must be unique" });
  }

  const newPerson = {
    //crea un nuevo objeto
    id: Math.floor(Math.random() * 1000000),
    name,
    number,
  };

  persons = persons.concat(newPerson);
  response.json(newPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
