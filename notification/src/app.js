const express = require("express");
const { connect } = require("./broker/broker");
const setListeners = require("./broker/listeners");

const app = express();

connect().then(() => {
  setListeners();
});

app.get("/", (req, res) => {
  res.send("Notification service is up and running");
});

module.exports = app;
