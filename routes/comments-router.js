const { deleteCommentById, updateCommentById } = require("../controller/comments.controller");

const commentsRouter = require("express").Router();

commentsRouter
.route("/:comment_id")
.delete(deleteCommentById)
.patch(updateCommentById);

// commentsRouter.delete("/:comment_id", deleteCommentById);

module.exports = commentsRouter;
