// const mongoose = require("mongoose");

// if (process.argv.length < 3) {
//   console.log("give password as argument");
//   process.exit(1);
// }

// const password = process.argv[2];
// const name = process.argv[3];
// const number = process.argv[4];

// const url = `mongodb+srv://falvarezz139:${password}@cluster0.vj5ig.mongodb.net/PhoneBook?retryWrites=true&w=majority`;

// mongoose.set("strictQuery", false);

// mongoose
//   .connect(url)
//   .then(() => {
//     console.log("Connected to MongoDB Atlas");

//     const blogSchema = new mongoose.Schema({
//       name: String,
//       number: String,
//     });

//     const Person = mongoose.model("Person", blogSchema);

//     if (name && number) {
//       const blog = new Person({
//         name,
//         number,
//       });

//       blog
//         .save()
//         .then(() => {
//           console.log(`added ${name} number ${number} to phonebook`);
//           mongoose.connection.close();
//         })
//         .catch((err) => {
//           console.error("Error saving blog:", err.message);
//           mongoose.connection.close();
//         });
//     } else {
//       Person.find({}).then((result) => {
//         console.log("phonebook:");
//         result.forEach((blog) => {
//           console.log(`${blog.name} ${blog.number}`);
//         });
//         mongoose.connection.close();
//       });
//     }
//   })
//   .catch((err) => {
//     console.error("Error connecting to MongoDB:", err.message);
//   });
