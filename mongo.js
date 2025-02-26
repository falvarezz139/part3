const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://falvarezz139:${password}@cluster0.vj5ig.mongodb.net/PhoneBook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  important: Boolean,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: "John Doe",
  number: "123-456-7890",
  important: true,
});

Person.find({})
  .then((result) => {
    console.log("All persons:");
    result.forEach((person) => {
      console.log(person);
    });

    return Person.find({ important: true });
  })
  .then((importantPersons) => {
    console.log("Persons with important: true:");
    importantPersons.forEach((person) => {
      console.log(person);
    });

    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error:", err.message);
  });
