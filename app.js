const express = require("express");
const { getApi } = require("./controller/api.controller");
const { getTopics } = require("./controller/topics.controller");
const app = express();

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.all("*", (req, res) => {
  res.status(404).send({ message: "Not Found" });
});

module.exports = app;
