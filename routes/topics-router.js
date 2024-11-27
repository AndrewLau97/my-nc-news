const { getTopics } = require("../controller/topics.controller");

const topicRouter=require("express").Router();

topicRouter.get("/", getTopics)

module.exports=topicRouter