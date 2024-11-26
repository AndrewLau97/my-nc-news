const {
  fetchArticleById,
  fetchArticle,
  fetchAllCommentsFromAnArticle,
  insertComment,
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
  fetchArticle().then((articles) => {
    res.status(200).send({ articles });
  });
}

function getAllCommentsFromAnArticle(req, res, next) {
  const { article_id } = req.params;
  fetchAllCommentsFromAnArticle(article_id).then((comments)=>{
      res.status(200).send({comments});
  }).catch((err)=>{
    next(err)
  })
}

function postCommentOnArticle(req,res,next){
    const{username,body}=req.body;
    const{article_id}=req.params;
insertComment(article_id,username,body).then((comment)=>{
    res.status(201).send({comment})
}).catch((err)=>{
    next(err)
})
}

module.exports = { getArticleById, getArticle, getAllCommentsFromAnArticle ,postCommentOnArticle};
