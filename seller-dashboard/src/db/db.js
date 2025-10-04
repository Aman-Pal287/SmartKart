const mongoose = require("mongoose");
const loggers = require("../utils/logger");
const logger = require("../utils/logger");

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("Connted to database");
  } catch (error) {
    logger.error("Database connection error: ", error);
  }
}

module.exports = connectToDB;
