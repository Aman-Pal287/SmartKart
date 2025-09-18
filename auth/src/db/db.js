const mongoose = require("mongoose");

async function connectToDb() {
  try {
    mongoose.connect(process.env.MONGO_URL).then(() => {
      console.log("Connected to DataBase");
    });
  } catch (error) {
    console.log("Datbase connection Failed", error);
  }
}

module.exports = connectToDb;
