const { fetchTopics, insertTopic } = require("../model/topics.models");

function getTopics(req, res) {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
}

function postTopic(req, res, next) {
  const { slug, description } = req.body;
  insertTopic(slug, description).then((topic) => {
    res.status(201).send({ topic });
  }).catch((err)=>{
    console.log(err);
    next(err)})
}

module.exports = { getTopics, postTopic };
