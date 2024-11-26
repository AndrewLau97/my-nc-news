const { fetchUsers } = require("../model/users.models")

function getUsers(req,res,next){
fetchUsers().then((users)=>{
    res.status(200).send({users})
})
}

module.exports={getUsers}