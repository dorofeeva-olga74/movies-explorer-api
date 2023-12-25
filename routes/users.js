const { getCurrentUser, updateUser } = require("../controllers/users.js");
const { getCurrentUserValidator, updateUserValidator } = require("../middlewares/validation.js");
//const { errors } = require("celebrate");
// создадим express router
const userRouter = require("express").Router();

// Здесь роутинг
//userRouter.get("/me", getCurrentUserValidator, getCurrentUser);
userRouter.get("/me", getCurrentUser);
// userRouter.get("/:userId", getCurrentUserValidator, getUserById);
 userRouter.patch("/me", updateUserValidator, updateUser);
//userRouter.patch("/me", updateUser);

//userRouter.use(errors());// обработчик ошибок celebrate
// экспортируем его
module.exports = userRouter; // экспортировали роутер