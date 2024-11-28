const express = require("express");
const { psqlErrors, customErrors, serverError } = require("./error-handling");
const app = express();
const apiRouter = require("./routes/api-router");
app.use(express.json());

app.use("/api", apiRouter);

app.all("*", (req, res) => {
  res.status(404).send({ message: "Not Found" });
});

app.use(psqlErrors);

app.use(customErrors);

app.use(serverError);

module.exports = app;
