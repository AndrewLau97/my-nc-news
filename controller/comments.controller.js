const {
  deleteCommentFromDB,
  checkCommentExists,
  patchCommentById,
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

function updateCommentById(req,res,next){
  const {comment_id}=req.params
  const {inc_votes}=req.body
  checkCommentExists(comment_id).then(()=>{
    return patchCommentById(comment_id,inc_votes)
  }).then((comment)=>{
    res.status(200).send({comment})
  }).catch(next)
}

module.exports = { deleteCommentById ,updateCommentById};
