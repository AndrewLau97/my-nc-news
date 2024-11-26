const {
  fetchArticleById,
  fetchArticle,
  fetchAllCommentsFromAnArticle,
  insertComment,
  alterArticle,
} = require("../model/articles.models");

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
  const {sort_by,order}=req.query
  fetchArticle(sort_by,order).then((articles) => {
    res.status(200).send({ articles });
  }).catch((err)=>{
    next(err)
  })
}

function getAllCommentsFromAnArticle(req, res, next) {
  const { article_id } = req.params;
  const promises = [
    fetchAllCommentsFromAnArticle(article_id),
    fetchArticleById(article_id),
  ];
  Promise.all(promises)
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
}

function postCommentOnArticle(req, res, next) {
  const { username, body } = req.body;
  const { article_id } = req.params;
  insertComment(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
}

function patchArticle(req, res, next) {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then(() => {
      return alterArticle(article_id, inc_votes);
    })
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
}

module.exports = {
  getArticleById,
  getArticle,
  getAllCommentsFromAnArticle,
  postCommentOnArticle,
  patchArticle,
};
