const { createUser } = require("../controllers/users");
//const { errors } = require("celebrate");
const { createUserValidator } = require("../middlewares/validation.js");

// создадим express router
const signupRouter = require("express").Router();

// Здесь роутинг
signupRouter.post("/", createUserValidator, createUser);

//signupRouter.use(errors());// обработчик ошибок celebrate
// экспортируем его
module.exports = signupRouter; // экспортировали роутер