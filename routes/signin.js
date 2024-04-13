const { errors } = require('celebrate');

// создадим express router
const signinRouter = require('express').Router();
const { login } = require('../controllers/users');
const { loginValidator } = require('../middlewares/validation');

signinRouter.post('/', loginValidator, login);

signinRouter.use(errors());// обработчик ошибок celebrate

module.exports = signinRouter; // экспортировали роутер
