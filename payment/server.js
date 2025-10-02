require("dotenv").config();
const app = require("./src/app");
const PORT = process.env.PORT || 3004;
const logger = require("./src/utils/logger");
const connectToDB = require("./src/db/db");

connectToDB();

app.listen(PORT, () => {
  logger.info(`Payment service is running on port: ${PORT}`);
});
