const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const UnauthorizedError = require('../errors/UnauthorizedError.js');

const userSchema = new mongoose.Schema({
  name: {
    type: String, // имя — это строка
    required: true, // имя — обязательное поле
    minlength: [2, "Mинимальная длина  — 2 символа"],
    maxlength: [30, "Максимальная длина— 30 символов"],
  },
  email: {
    type: String, //  — это строка
    unique: true, // - уникальный элемент
    required: true, //  — обязательное поле
    validate: {
      validator(email) {
        validator.isEmail(email);
      },
      message: 'Введите корректный email',
    },
  },
  password: {
    type: String, //  — это строка
    required: true, //  — обязательное поле
    select: false, // - чтобы API не возвращал хеш пароля
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select("+password")
    .then((user) => {
      // не нашёлся — отклоняем промис
      if (!user) {
        throw new UnauthorizedError("Неправильные почта или пароль");
      }
      // нашёлся — сравниваем хеши
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError("Неправильные почта или пароль");
          }
          return user;
        });
    });
};

// создаём модель и экспортируем её
module.exports = mongoose.model("user", userSchema);
