const db = require("../db/connection");
const format = require("pg-format");

function fetchArticleById(article_id) {
  const queryInsert = `SELECT articles.article_id, articles.author,title,articles.body,topic,articles.created_at,articles.votes,article_img_url, COUNT(comments.body) AS comment_count 
  FROM articles 
  LEFT JOIN comments 
  ON articles.article_id=comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id`;
  return db.query(queryInsert, [article_id]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, message: "Not Found" });
    } else {
      return result.rows[0];
    }
  });
}

function checkIfArticleExists(article_id) {
  const queryInsert = `SELECT * FROM articles WHERE article_id = $1`;
  return db.query(queryInsert, [article_id]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, message: "Not Found" });
    }
  });
}

// function fetchArticle(
//   sort_by = "created_at",
//   order = "desc",
//   topic,
//   limit = 10,
//   p = 1
// ) {
//   const validOrderQueries = /^(asc)$|^(desc)$/i;
//   const validSortByQueries = [
//     "article_id",
//     "title",
//     "topic",
//     "author",
//     "created_at",
//     "votes",
//     "comment_count",
//   ];
//   const offset = (p - 1) * limit;
//   if (
//     !validOrderQueries.test(order) ||
//     !validSortByQueries.includes(sort_by.toLowerCase()) ||
//     limit <= 0 ||
//     p <= 0
//   ) {
//     return Promise.reject({ status: 400, message: "Bad request" });
//   }
//   const queryValues = [];
//   let queryInsert = `SELECT articles.article_id, articles.author, title, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.body) AS comment_count
//  FROM articles LEFT JOIN comments
//  ON articles.article_id=comments.article_id `;
//   if (topic) {
//     queryInsert += `WHERE topic = $1 `;
//     queryValues.push(topic);
//   }
//   queryInsert += `GROUP BY articles.article_id
//   ORDER BY ${sort_by} ${order} `;
//   if (topic) {
//     queryInsert += `LIMIT $2 OFFSET $3`;
//   } else {
//     queryInsert += `LIMIT $1 OFFSET $2`;
//   }
//   queryValues.push(limit);
//   queryValues.push(offset);

//   return db.query(queryInsert, queryValues).then(({ rows }) => {
//     return rows;
//   });
// }

function fetchArticle(
  sort_by = "created_at",
  order = "desc",
  topic,
  limit = 10,
  p = 1,
  total_count
) {
  const validOrderQueries = /^(asc)$|^(desc)$/i;
  const validSortByQueries = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "comment_count",
  ];
  if (
    !validOrderQueries.test(order) ||
    !validSortByQueries.includes(sort_by.toLowerCase()) ||
    limit <= 0 ||
    p <= 0
  ) {
    return Promise.reject({ status: 400, message: "Bad request" });
  }
  const lastPage = Math.ceil(total_count / limit);
  const offset = p > lastPage ? (lastPage - 1) * limit : (p - 1) * limit;
  const queryValues = [];
  let queryInsert = `SELECT articles.article_id, articles.author, title, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.body) AS comment_count 
 FROM articles LEFT JOIN comments
 ON articles.article_id=comments.article_id `;
  if (topic) {
    queryInsert += `WHERE topic = $1 `;
    queryValues.push(topic);
  }
  queryInsert += `GROUP BY articles.article_id 
  ORDER BY ${sort_by} ${order} `;
  if (topic) {
    queryInsert += `LIMIT $2 OFFSET GREATEST($3,0)`;
  } else {
    queryInsert += `LIMIT $1 OFFSET GREATEST($2,0)`;
  }
  queryValues.push(limit);
  queryValues.push(offset);

  return db.query(queryInsert, queryValues).then(({ rows }) => {
    return rows;
  });
}

function fetchAllCommentsFromAnArticle(article_id, limit = 10, page = 1) {
  if (limit <= 0 || page <= 0) {
    return Promise.reject({ status: 400, message: "Bad request" });
  }
  const offset = (page - 1) * limit;
  let queryInsert = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC `;
  queryInsert += `LIMIT $2 OFFSET $3`;
  return db.query(queryInsert, [article_id, limit, offset]).then((results) => {
    return results.rows;
  });
}

function insertComment(article_id, username, body) {
  const queryInsert = `INSERT INTO comments(article_id,author,body) 
    VALUES %L RETURNING *`;
  const queryValues = [[article_id, username, body]];
  const formattedComment = format(queryInsert, queryValues);
  return db.query(formattedComment).then((results) => {
    return results.rows[0];
  });
}

function alterArticle(article_id, inc_votes) {
  if (!inc_votes || !(typeof inc_votes === "number")) {
    return Promise.reject({
      status: 400,
      message: "Invalid information given, please check information is correct",
    });
  }
  return db
    .query(`SELECT votes from articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      return rows[0].votes;
    })
    .then((votes) => {
      const newVotes = votes + inc_votes >= 0 ? votes + inc_votes : 0;
      return db
        .query(
          `UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *`,
          [newVotes, article_id]
        )
        .then(({ rows }) => {
          return rows[0];
        });
    });
}

function checkTopicExists(topic) {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Not Found" });
      }
    });
}

function insertArticle(author, title, body, topic, article_img_url) {
  let queryInsert = `INSERT INTO articles(author, title, body, topic`;
  const queryValues = [[author, title, body, topic]];
  if (article_img_url) {
    queryInsert += `, article_img_url)
    VALUES %L RETURNING *`;
    queryValues[0].push(article_img_url);
  } else {
    queryInsert += `)
    VALUES %L RETURNING *`;
  }
  const formattedData = format(queryInsert, queryValues);
  return db.query(formattedData).then(({ rows }) => {
    return rows[0].article_id;
  });
}

function countArticles(topic) {
  let queryInsert = `SELECT * FROM articles `;
  const queryValues = [];
  if (topic) {
    queryInsert += `WHERE topic =$1 `;
    queryValues.push(topic);
  }
  return db.query(queryInsert, queryValues).then(({ rows }) => {
    return rows.length;
  });
}

function deleteCommentFromDB(article_id) {
  return db.query(`DELETE FROM articles WHERE article_id = $1`, [article_id]);
}

module.exports = {
  fetchArticleById,
  fetchArticle,
  fetchAllCommentsFromAnArticle,
  insertComment,
  alterArticle,
  checkTopicExists,
  checkIfArticleExists,
  insertArticle,
  countArticles,
  deleteCommentFromDB,
};
