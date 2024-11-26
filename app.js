const express = require("express");
const { getApi } = require("./controller/api.controller");
const { getTopics } = require("./controller/topics.controller");
const {
  getArticleById,
  getArticle,
  getAllCommentsFromAnArticle,
  postCommentOnArticle,
  patchArticle,
} = require("./controller/articles.controller");
const { psqlErrors, customErrors, serverError } = require("./error-handling");
const { deleteCommentById } = require("./controller/comments.controller");
const { getUsers } = require("./controller/users.controllers");
const app = express();
app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticle);

app.get("/api/articles/:article_id/comments", getAllCommentsFromAnArticle);

app.post("/api/articles/:article_id/comments", postCommentOnArticle);

app.patch("/api/articles/:article_id", patchArticle);

app.delete("/api/comments/:comment_id",deleteCommentById);

app.get("/api/users", getUsers)

app.all("*", (req, res) => {
  res.status(404).send({ message: "Not Found" });
});

app.use(psqlErrors);

app.use(customErrors);

app.use(serverError);

module.exports = app;
