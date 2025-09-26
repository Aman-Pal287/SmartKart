const mongoose = require("mongoose");

async function connectToDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DataBase");
  } catch (error) {
    console.log("Datbase connection Failed", error);
  }
}

module.exports = connectToDb;
