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

function fetchArticle(sort_by = "created_at", order = "desc") {
  let queryInsert = `SELECT articles.article_id, articles.author, title, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.body) AS comment_count 
 FROM articles LEFT JOIN comments
 ON articles.article_id=comments.article_id
 GROUP BY articles.article_id `;
  queryInsert += `ORDER BY ${sort_by} ${order}`;

  return db.query(queryInsert).then((results) => {
    return results.rows;
  });
}

function fetchAllCommentsFromAnArticle(article_id) {
    const queryInsert=`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`
    return db.query(queryInsert,[article_id]).then((results)=>{
        if(results.rows.length===0){
            return Promise.reject({status:404,message:"Not Found"})
        }else{
            return results.rows
        }
        })
}

module.exports = {
  fetchArticleById,
  fetchArticle,
  fetchAllCommentsFromAnArticle,
};
