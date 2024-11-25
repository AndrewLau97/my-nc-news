const db = require("../db/connection");

function fetchArticleById(article_id) {
  const queryInsert = `SELECT * FROM articles WHERE article_id = $1`;
  return db.query(queryInsert, [article_id]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, message: "Not Found" });
    } else {
      return result.rows[0];
    }
  });
}

module.exports = { fetchArticleById };
