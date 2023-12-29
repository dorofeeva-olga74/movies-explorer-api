const { errors } = require('celebrate');
// создадим express router
const signupRouter = require('express').Router();
const { createUserValidator } = require('../middlewares/validation');
const { createUser } = require('../controllers/users');

signupRouter.post('/', createUserValidator, createUser);

signupRouter.use(errors());// обработчик ошибок celebrate

module.exports = signupRouter; // экспортировали роутер
