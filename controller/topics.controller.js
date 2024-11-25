const fetchTopics = require("../model/topics.models");

function getTopics(req, res) {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
}

module.exports = { getTopics };
