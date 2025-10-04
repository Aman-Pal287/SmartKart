require("dotenv").config();
const app = require("./src/app");
const PORT = process.env.PORT || 3004;
const logger = require("./src/utils/logger");
const connectToDB = require("./src/db/db");
const { connect } = require("./src/broker/broker");

connectToDB();
connect();

app.listen(PORT, () => {
  logger.info(`Payment service is running on port: ${PORT}`);
});
