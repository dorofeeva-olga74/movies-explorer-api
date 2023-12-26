const { login } = require("../controllers/users.js");
const { errors } = require("celebrate");
const { loginValidator } = require("../middlewares/validation.js");

// создадим express router
const signinRouter = require("express").Router();


signinRouter.post("/", loginValidator, login);

signinRouter.use(errors());// обработчик ошибок celebrate

module.exports = signinRouter; // экспортировали роутер