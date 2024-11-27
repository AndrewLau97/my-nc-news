const { fetchUsers, fetchUserbyUsername } = require("../model/users.models")

function getUsers(req,res,next){
fetchUsers().then((users)=>{
    res.status(200).send({users})
})
}

function getUserByUsername(req,res,next){
    const {username}=req.params
fetchUserbyUsername(username).then((user)=>{
    res.status(200).send({user})
}).catch(next)
}

module.exports={getUsers ,getUserByUsername}