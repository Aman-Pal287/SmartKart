require("dotenv").config();
const app = require("./src/app");
const loggers = require("./src/utils/logger");
const PORT = process.env.PORT || 3007;

const connectToDB = require("./src/db/db");
const listener = require("./src/broker/listener");
const { connect } = require("./src/broker/broker");

connectToDB();

connect().then(() => {
  listener();
});

app.listen(PORT, () => {
  loggers.info(`Seller-dash-board service is running on port: ${PORT}`);
});
