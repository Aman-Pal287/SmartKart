require("dotenv").config();
const app = require("./src/app");
const logger = require("./src/utils/logger");
const PORT = process.env.PORT || 3006;

app.listen(PORT, () => {
  logger.info(`Notification server is running on port: ${PORT}`);
});
