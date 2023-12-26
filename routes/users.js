const { getCurrentUser, updateUser } = require("../controllers/users.js");
const { updateUserValidator } = require("../middlewares/validation.js");
const { errors } = require("celebrate");

// создадим express router
const userRouter = require("express").Router();

// Здесь роутинг
userRouter.get("/me", getCurrentUser);

userRouter.patch("/me", updateUserValidator, updateUser);

userRouter.use(errors());// обработчик ошибок celebrate

module.exports = userRouter; // экспортировали роутер