/* eslint-disable no-unused-vars */
require("dotenv").config();
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    minlength: 3,
    unique: true,
  },
  number: {
    type: String,
    required: [true, "number is required"],
    minlength: 8,
    validate: {
      validator: function (number) {
        return /\d{1}-\d{2}-\d{4}/.test(number);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
});
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

personSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Person", personSchema);
