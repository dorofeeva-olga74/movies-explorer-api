/* eslint-disable linebreak-style */
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { JWT_SECRET } = process.env;
const UnauthorizedError = require('../errors/UnauthorizedError');

const {
  ERROR_UNAUTHORIZED_MESSAGE,
} = require('../utils/constants');

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
