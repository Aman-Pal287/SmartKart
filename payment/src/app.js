const express = require("express");
const cookieParser = require("cookie-parser");
const paymentRoutes = require("./routes/payment.route");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cookieParser());

/* using cors */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Payment Service is up and running",
  });
});

app.use("/api/payments", paymentRoutes);

module.exports = app;
