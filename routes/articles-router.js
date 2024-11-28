const {
  getArticleById,
  getArticle,
  getAllCommentsFromAnArticle,
  postCommentOnArticle,
  patchArticle,
  postArticle,
} = require("../controller/articles.controller");

const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getArticle).post(postArticle);

articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticle);

articlesRouter
  .route("/:article_id/comments")
  .get(getAllCommentsFromAnArticle)
  .post(postCommentOnArticle);

module.exports = articlesRouter;
