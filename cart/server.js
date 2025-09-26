require("dotenv").config();
const app = require("./src/app");
const PORT = process.env.PORT || 3002;
const connectToDb = require("./src/db/db");

connectToDb()

app.listen(PORT, () => {
  console.log(`Cart service is running on port: ${PORT}`);
});
