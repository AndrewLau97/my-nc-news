const db = require("../db/connection");

function fetchUsers() {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
}

function fetchUserbyUsername(username) {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows }) => {
        if(rows.length===0){
            return Promise.reject({status:404,message:"Not Found"})
        }else{
            return rows[0];
        }
    });
}

module.exports = { fetchUsers, fetchUserbyUsername };
