const db = require("../db/connection");
const format = require("pg-format");

function fetchTopics() {
  return db.query(`SELECT * FROM topics`).then((results) => {
    return results.rows;
  });
}

function insertTopic(slug, description) {
  const queryInsert=`INSERT INTO topics (slug, description)
 VALUES %L RETURNING *`
const queryValues = [[slug,description]]
  const formattedData = format(queryInsert, queryValues);
  return db.query(formattedData).then(({rows}) => {
    return rows[0];
  });
}

module.exports = { fetchTopics, insertTopic };
