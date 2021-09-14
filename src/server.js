const express = require("express");
const connectMongoDb = require("./connectMongo");
require("dotenv").config({ path: "./config/.env" });
const myData = require("./data");
const person = require("./personModel");

const app = express();
const Port = process.env.Port || 8080;

//Installing and setting up Mongoose-----------------------------------
// check the file in ./connectMongoDb.js

connectMongoDb();

//Create a person prototype-------------------------------------------
//check the file in ./personModel.js

//Create and Save a Record of a Model--------------------------------

const person_1 = new person({
  name: "Paul",
  age: 25,
  favoriteFoods: ["Yam", "Spaghetti"],
});
person_1.save(function (err, doc) {
  if (err) return console.error(err);
  console.log("Document inserted succussfully : ", doc);
});

//Create Many Records with model.create()------------------------------

(async () => {
  try {
    const result = await person.create([
      { name: "Ahmed", age: 40, favoriteFoods: ["Bread"] },
      { name: "Ali", age: 35, favoriteFoods: ["Pizza"] },
      { name: "Amal", age: 30, favoriteFoods: ["Tuwo"] },
    ]);
    console.log("Multiple records added successfully");
  } catch (error) {
    console.log(error);
  }
})();

//Use model.find() to Search Your Database -----------------------------

(async () => {
  try {
    const result = await person.find({ name: "Ahmed" });
    console.log("Result of search : ", result);
  } catch (error) {
    console.log(error);
  }
})();
//Use model.findOne() to Return a Single Matching Document from Your Database ----------

(async () => {
  try {
    const result = await person.findOne({ name: "Amal" });
    console.log("Result of search with findone : ", result);
  } catch (error) {
    console.log(error);
  }
})();
//Use model.findById() to Search Your Database By _id--------------------

(async () => {
  try {
    const result = await person.findOne({ _id: "60fabe8c17e2743f20cb42a4" });
    console.log("Result of search with Id : ", result);
  } catch (error) {
    console.log(error);
  }
})();

//Perform Classic Updates by Running Find, Edit, then Save ---------------

(async () => {
  try {
    const result = await person.findOne({ _id: "60fabe8c17e2743f20cb42a4" });
    result.favoriteFoods.push("hamburger");
    result.markModified("favoriteFoods");
    await result.save();
  } catch (error) {
    console.log(error);
  }
})();

//Perform New Updates on a Document Using model.findOneAndUpdate()-------------

(async () => {
  try {
    const result = await person.findOneAndUpdate(
      { name: "Ali" },
      { $set: { age: 20 } },
      { new: true }
    );
    console.log("Result of findOneAndUpdate : ", result);
  } catch (error) {
    console.log(error);
  }
})();

//Delete One Document Using model.findByIdAndRemove------------------------

(async () => {
  try {
    const result = await person.findByIdAndRemove({
      _id: "60fabf0f6064770808257df6",
    });
    console.log("Result of findByIdAndRemove : ", result);
  } catch (error) {
    console.log(error);
  }
})();

//MongoDB and Mongoose - Delete Many Documents with model.remove()------------

(async () => {
  try {
    person.remove({ name: "Mary" }, function (err, res) {
      if (err) console.log(err);
      else console.log("Result of remove : ", res);
    });
  } catch (error) {
    console.log(error);
  }
})();

//Chain Search Query Helpers to Narrow Search Results--------------------

(async () => {
  try {
    await person
      .find({ favoriteFoods: "burritos" })
      .sort({ age: 1 })
      .limit(2)
      .select({ age: false })
      .exec()
      .then((doc) => console.log("The last result : ", doc))
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(error);
  }
})();

//Creation of a listener for the app ------------

app.listen(Port, (err) => {
  if (err) {
    throw err;
  } else {
    console.log(`server is listening on port ${Port}`);
  }
});