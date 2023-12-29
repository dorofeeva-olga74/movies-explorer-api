const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const UnauthorizedError = require('../errors/UnauthorizedError');
const {
  INVALID_EMAIL,
  INVALID_EMAIL_OR_PASSWORD,
  MIN_LENGTH,
  MAX_LENGTH,
} = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String, // имя — это строка
    required: true, // имя — обязательное поле
    minlength: [2, MIN_LENGTH],
    maxlength: [30, MAX_LENGTH],
  },
  email: {
    type: String, //  — это строка
    unique: true, // - уникальный элемент
    required: true, //  — обязательное поле
    validate: {
      validator(email) {
        validator.isEmail(email);
      },
      message: INVALID_EMAIL,
    },
  },
  password: {
    type: String, //  — это строка
    required: true, //  — обязательное поле
    select: false, // - чтобы API не возвращал хеш пароля
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      // не нашёлся — отклоняем промис
      if (!user) {
        throw new UnauthorizedError(INVALID_EMAIL_OR_PASSWORD);
      }
      // нашёлся — сравниваем хеши
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError(INVALID_EMAIL_OR_PASSWORD);
          }
          return user;
        });
    });
};

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
