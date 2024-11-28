const db = require("../db/connection");
// const format = require("pg-format");

function deleteCommentFromDB(comment_id) {
  return db
    .query(`DELETE FROM comments WHERE comment_id=$1 RETURNING *`, [comment_id])
    .then(() => {});
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

function patchCommentById(comment_id, inc_votes){
  if(!inc_votes){
    return Promise.reject({status:400, message:"Bad request"})
  }
return db.query(`UPDATE comments SET votes = GREATEST((votes + $1),0) WHERE comment_id = $2 RETURNING *`,[inc_votes,comment_id]).then(({rows})=>{return rows[0]})
}


module.exports = { deleteCommentFromDB, checkCommentExists ,patchCommentById};
