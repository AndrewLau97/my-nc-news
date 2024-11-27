const { deleteCommentById } = require("../controller/comments.controller");

const commentsRouter=require("express").Router();

commentsRouter.delete("/:comment_id", deleteCommentById)


module.exports=commentsRouter