const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3, //al menos 3 caracteres para completar la validación
  },
  number: {
    type: String,
    required: true,
    minLength: 8, //mínimo 8 caracteres
  },
});

// Para hacer la conversión de _id a id y eliminar campos innecesarios
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
