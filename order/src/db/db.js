const mongoose = require("mongoose");
const logger = require("../utils/logger");
async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("Connected to DataBase");
  } catch (error) {
    console.log("Database connection error: ", error);
  }
}

module.exports = connectToDB;
