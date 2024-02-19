// импортируем нужные модули
const winston = require('winston');
const expressWinston = require('express-winston');

// создадим логгер запросов
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'request.log' }), // отвечает за то, куда нужно писать лог
  ],
  format: winston.format.json(), // отвечает за формат записи логов//json
});
// логгер ошибок
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
  ],
  format: winston.format.json(),
});
module.exports = {
  requestLogger,
  errorLogger,
};
