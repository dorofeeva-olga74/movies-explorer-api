/* eslint-disable linebreak-style */
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;
const UnauthorizedError = require('../errors/UnauthorizedError');
const {
  ERROR_UNAUTHORIZED_MESSAGE,
} = require('../utils/constants');

module.exports = async (req, res, next) => {
  // Верификация токена
  let payload;
  const token = req.headers.authorization;
  try {
    if (!token || !token.startsWith('Bearer')) {
      throw new UnauthorizedError(ERROR_UNAUTHORIZED_MESSAGE);
    }
    const validTocken = token.replace('Bearer ', '');
    payload = jwt.verify(await validTocken, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    // Добавление пейлоуда в объект запроса
    req.user = payload;
    next();
  } catch (err) {
    return next(new UnauthorizedError(ERROR_UNAUTHORIZED_MESSAGE));
  }
  return next();
};
