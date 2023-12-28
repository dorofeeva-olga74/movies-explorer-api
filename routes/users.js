const { errors } = require('celebrate');
// создадим express router
const userRouter = require('express').Router();
const { getCurrentUser, updateUser } = require('../controllers/users');
const { updateUserValidator } = require('../middlewares/validation');

// Здесь роутинг
userRouter.get('/me', getCurrentUser);

userRouter.patch('/me', updateUserValidator, updateUser);

userRouter.use(errors()); // обработчик ошибок celebrate

module.exports = userRouter; // экспортировали роутер
