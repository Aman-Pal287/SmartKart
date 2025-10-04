const mongoose = require("mongoose");
const logger = require("../utils/logger");

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("Connected to database");
  } catch (error) {
    logger.error("Database connection error: ", error);
    process.exit(1);
  }
}

module.exports = connectToDB;
