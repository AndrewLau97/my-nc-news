const express = require("express");
const { getApi } = require("./controller/api.controller");
const { getTopics } = require("./controller/topics.controller");
const {
  getArticleById,
  getArticle,
  getAllCommentsFromAnArticle,
} = require("./controller/articles.controller");
const { psqlErrors, customErrors, serverError } = require("./error-handling");
const app = express();

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticle);

app.get("/api/articles/:article_id/comments", getAllCommentsFromAnArticle);

app.all("*", (req, res) => {
  res.status(404).send({ message: "Not Found" });
});

app.use(psqlErrors);

app.use(customErrors);

app.use(serverError);

module.exports = app;
