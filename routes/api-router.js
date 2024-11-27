const { getApi } = require("../controller/api.controller");
const topicRouter = require("./topics-router");
const articlesRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const usersRouter = require("./users-router");
const apiRouter = require("express").Router();

apiRouter.use("/topics", topicRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);

apiRouter.get("/", getApi);

module.exports = apiRouter;
