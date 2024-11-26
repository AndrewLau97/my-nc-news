const db = require("../db/connection");
// const format = require("pg-format");

function deleteCommentFromDB(comment_id) {
  return db
    .query(`DELETE FROM comments WHERE comment_id=$1 RETURNING *`, [comment_id]).then(()=>{})
    // .then(({ rowCount }) => {
    //   if (!rowCount) {
    //     return Promise.reject({ status: 404, message: "Not Found" });
    //   }
    // });
}

function checkCommentExists(comment_id) {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Not Found" });
      }
    });
}

module.exports = { deleteCommentFromDB, checkCommentExists };
