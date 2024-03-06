const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const { NODE_ENV, PORT, MONGO_URL } = process.env;

// eslint-disable-next-line no-console
console.log(NODE_ENV); // production

const mongoose = require('mongoose');
const helmet = require('helmet');

const { errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const cors = require('./middlewares/cors');

const router = require('./routes'); // импортируем роутеры

const app = express();

const NotFoundError = require('./errors/NotFoundError');
const { ERROR_NOTFOUND_MESSAGE } = require('./utils/constants');

const errorInternalServer = require('./middlewares/errorInternalServer');

// Слушаем 3000 порт
mongoose.connect(MONGO_URL || 'mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
});
const limiter = require('./middlewares/limiter');

// мидлвэр
app.use(express.json());

app.use(cors);
app.use(requestLogger); // подключаем логгер запросов до всех обработчиков роутов
app.use(limiter); // подключаем rate-limiter

app.use(helmet());

app.use('/', router); // запускаем роутер
// errors
app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use((req, res, next) => next(new NotFoundError(ERROR_NOTFOUND_MESSAGE)));
app.use(errorInternalServer);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
