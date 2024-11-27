const { getUsers } = require("../controller/users.controllers");

const usersRouter=require("express").Router();

usersRouter.get("/", getUsers)

module.exports=usersRouter