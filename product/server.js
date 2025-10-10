require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/db/db");
PORT = process.env.PORT || 3001;
const { connect } = require("./src/broker/broker");

// Database connection
connectDB();

// RabbitMQ Connection
connect();

app.listen(PORT, () => {
  console.log(`Product service is running on port ${PORT}`);
});
