require("dotenv").config();
const loggers = require("./src/utils/logger");
const app = require("./src/app");
const PORT = process.env.PORT || 3007;
<<<<<<< HEAD
const connectToDB = require("./src/db/db");

connectToDB();
=======
>>>>>>> da201fab61205b07f04ffd27722f177720b1dcc6

app.listen(PORT, () => {
  loggers.info(`Seller-dash-board service is running on port: ${PORT}`);
});
