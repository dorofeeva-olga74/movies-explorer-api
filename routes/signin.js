const { errors } = require('celebrate');
// создадим express router
const signinRouter = require('express').Router();
const { loginValidator } = require('../middlewares/validation');
const { login } = require('../controllers/users');

signinRouter.post('/', loginValidator, login);

signinRouter.use(errors());// обработчик ошибок celebrate

module.exports = signinRouter; // экспортировали роутер
