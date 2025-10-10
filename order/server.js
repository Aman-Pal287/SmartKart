require("dotenv").config();

const app = require("./src/app");
const PORT = process.env.PORT || 3003;
const logger = require("./src/utils/logger");
const connectToDB = require("./src/db/db");
const { connect } = require("./src/broker/broker");

// database connection
connectToDB();

// rabbitMQ connection
connect();

app.listen(PORT, () => {
  logger.info(`Order service is running on port: ${PORT}`);
});
