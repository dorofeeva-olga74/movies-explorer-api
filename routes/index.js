// создадим express router
const router = require("express").Router();
const userRouter = require("./users");
const movieRouter = require("./movies");
const signinRouter = require("./signin");
const signupRouter = require("./signup");
const auth = require("../middlewares/auth");

const NotFoundError = require("../errors/NotFoundError.js");

const pageNotAccess = (req, res, next) => {
  return next(new NotFoundError("Страница не найдена"));//404
};

router.use("/signin", signinRouter); //login
router.use("/signup", signupRouter); //createUser
// авторизация
router.use(auth);/// защищаем доступ к роутам, расположенным ниже
router.use("/users", userRouter);
router.use("/movies", movieRouter);
router.use("*", pageNotAccess);

module.exports = router;