const mongoose = require("mongoose");

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DataBase");
  } catch (error) {
    console.log("Database connection error: ", error);
  }
}

module.exports = connectToDB;
