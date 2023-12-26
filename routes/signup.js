const { createUser } = require("../controllers/users");
const { errors } = require("celebrate");
const { createUserValidator } = require("../middlewares/validation.js");

// создадим express router
const signupRouter = require("express").Router();

signupRouter.post("/", createUserValidator, createUser);

signupRouter.use(errors());// обработчик ошибок celebrate

module.exports = signupRouter; // экспортировали роутер