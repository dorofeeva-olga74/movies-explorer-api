const ERROR_INTERNAL_SERVER = 500;// вынесены магические числа
const ERROR_SERVER_MESSAGE = require('../utils/constants');

module.exports = (err, req, res, next) => { // централизованный обработчик ошибок
  // если у ошибки нет статуса, выставляем 500 - ERROR_INTERNAL_SERVER
  const { statusCode = ERROR_INTERNAL_SERVER, message } = err;// 500
  res.status(statusCode).send({
    // проверяем статус и выставляем сообщение в зависимости от него
    message: statusCode === ERROR_INTERNAL_SERVER
      ? ERROR_SERVER_MESSAGE
      : message,
  });
  next();
};
