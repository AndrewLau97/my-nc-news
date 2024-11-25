const { fetchArticleById, fetchArticle } = require("../model/articles.models");

function getArticleById(req, res, next) {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
}

function getArticle(req, res, next) {
  fetchArticle().then((articles) => {
    console.log(articles);
    res.status(200).send({ articles });
  });
}

module.exports = { getArticleById, getArticle };
