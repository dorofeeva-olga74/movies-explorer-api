/* eslint-disable linebreak-style */
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { JWT_SECRET } = process.env;
const UnauthorizedError = require('../errors/UnauthorizedError');

const {
  ERROR_UNAUTHORIZED_MESSAGE,
} = require('../utils/constants');

// module.exports = (req, res, next) => {
//   // Верификация токена
//   const token = req.headers.authorization;
//   if (!token || !token.startsWith('Bearer')) {
//     // console.log('auth1')
//     throw new UnauthorizedError(ERROR_UNAUTHORIZED_MESSAGE);
//   }
//   try {
//     const validTocken = token.replace('Bearer ', '');
//     // payload = jwt.verify(validTocken, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
// const payload = jwt.verify(validTocken,
// NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
//     // Добавление пейлоуда в объект запроса
//     req.user = payload;
//     // next();
//   } catch (err) {
//     // console.log('auth2')
//     return next(new UnauthorizedError(ERROR_UNAUTHORIZED_MESSAGE));
//   }
//   return next();
// };

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedError(ERROR_UNAUTHORIZED_MESSAGE);
    }
    const token = authorization.replace('Bearer ', '');
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    next(new UnauthorizedError(ERROR_UNAUTHORIZED_MESSAGE));
  }
};
// module.exports = (req, res, next) => {
//   try {
//     const { token } = req.headers;

//     if (!token || !token.startsWith('Bearer ')) {
//       throw new UnauthorizedError(ERROR_UNAUTHORIZED_MESSAGE);
//     }
//     const validTocken = token.replace('Bearer ', '');
//     req.user = jwt.verify(validTocken, JWT_SECRET);
//     next();
//   } catch (err) {
//     return next(new UnauthorizedError(ERROR_UNAUTHORIZED_MESSAGE));
//   }
//   return next();
// };
