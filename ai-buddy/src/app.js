const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Ai-Buddy Service is up and running",
  });
});

module.exports = app;
