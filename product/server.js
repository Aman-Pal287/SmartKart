require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/db/db");
PORT = process.env.PORT || 3001;


// Database connection
connectDB();

app.listen(PORT, () => {
  console.log(`Product service is running on port ${PORT}`);
});
