/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

if (process.argv.length < 3) {
  console.log(
    "please povide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
});

process.argv.length > 3 &&
  person.save().then((result) => {
    console.log(
      `added ${process.argv[3]} number ${process.argv[4]} to phonebook`
    );
    mongoose.connection.close();
  });

process.argv.length === 3 &&
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
