const {
  deleteCommentFromDB,
  checkCommentExists,
} = require("../model/comments.models");

function deleteCommentById(req, res, next) {
  const { comment_id } = req.params;
  // deleteCommentFromDB(comment_id).then((result)=>{
  //     res.status(204).send({})
  // }).catch(next)
  const promises = [
    deleteCommentFromDB(comment_id),
    checkCommentExists(comment_id),
  ];
  Promise.all(promises)
    .then(() => {
      res.status(204).send({});
    })
    .catch(next);
}

module.exports = { deleteCommentById };
