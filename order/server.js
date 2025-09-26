require("dotenv").config();
const app = require("./src/app");
const PORT = process.env.PORT || 3003;
const connectToDB = require("./src/db/db");

connectToDB();

app.listen(PORT, () => {
  console.log(`Order service is running on port: ${PORT}`);
});
