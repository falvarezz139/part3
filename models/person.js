const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // El nombre es obligatorio
    minLength: 3, // El nombre debe tener al menos 3 caracteres
  },
  number: {
    type: String,
    required: true, // El número es obligatorio
    validate: {
      validator: function (v) {
        // Valida el número de teléfono con el formato adecuado (ej. 09-1234567 o 040-12345678)
        return /^[0-9]{2,3}-[0-9]+$/.test(v);
      },
      message: (props) => `${props.value} no es un número de teléfono válido!`,
    },
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
