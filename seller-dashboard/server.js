require("dotenv").config();
const loggers = require("./src/utils/logger");
const app = require("./src/app");
const PORT = process.env.PORT || 3007;

app.listen(PORT, () => {
  loggers.info(`Seller-dash-board service is running on port: ${PORT}`);
});
