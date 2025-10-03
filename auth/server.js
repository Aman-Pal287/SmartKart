require("dotenv").config();
const app = require("./src/app");
const PORT = process.env.PORT || 3000;
const connectDB = require("./src/db/db");
const { connect } = require("./src/broker/broker");

connectDB();
connect();

app.listen(PORT, () => {
  console.log(`Auth service is running on port ${PORT}`);
});
