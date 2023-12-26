require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const httpConstants = require("http2").constants;

const BadRequest = require("../errors/BadRequest.js");
const NotFoundError = require("../errors/NotFoundError.js");
const Conflict = require("../errors/Conflict.js");

const ERROR_CODE_DUPLICATE_MONGO = 11000; //вынесены магические числа
const SOLT_ROUNDS = 10; // хешируем пароль
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, } = req.body;
    const hash = await bcrypt.hash(password, SOLT_ROUNDS);
    const newUser = await User.create({ name, email, password: hash });
    return res.status(httpConstants.HTTP_STATUS_CREATED).send({
      name: newUser.name,
      _id: newUser._id,
      email: newUser.email,
    });
  } catch (err) {
    if (err.code === ERROR_CODE_DUPLICATE_MONGO) {
      return next(new Conflict("Пользователь уже существует"));
    } else if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequest("Переданы некорректные данные"));
    }
    else {
      return next(err);
    }
  }
};

module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id)
      .orFail(() => {
        throw new NotFoundError({ message: "Пользователь по id не найден" });
      });
    return res.status(httpConstants.HTTP_STATUS_OK).send(currentUser);
  } catch (err) {
    return next(err);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const updateUser = await User.findByIdAndUpdate(req.user._id, { name, email }, { new: "true", runValidators: "true" });
    return res.status(httpConstants.HTTP_STATUS_OK).send(await updateUser.save());
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequest("Переданы некорректные данные"));
    } else {
      return next(err);
    }
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password)
    const token = await jwt.sign({ _id: user._id }, NODE_ENV === 'production'? JWT_SECRET : "dev-secret", { expiresIn: "7d" }); //exp (expiration time) — время жизни токена.
    return res.status(httpConstants.HTTP_STATUS_OK).send({ token });
  } catch (err) {
    next(err);
  }
};