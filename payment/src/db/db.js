const mongoose = require("mongoose");
const logger = require("../utils/logger");

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("connected to database");
  } catch (error) {
    logger.error(error);
  }
}

module.exports = connectToDB;
