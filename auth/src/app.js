const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Auth Service is up and running" });
});

const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

app.use("/", (req, res) => {
  res.status(201).json("helo worlkd");
});

module.exports = app;
