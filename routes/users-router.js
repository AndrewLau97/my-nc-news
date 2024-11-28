const {
  getUsers,
  getUserByUsername,
} = require("../controller/users.controllers");

const usersRouter = require("express").Router();

usersRouter.get("/", getUsers);

usersRouter.get("/:username", getUserByUsername);

module.exports = usersRouter;
