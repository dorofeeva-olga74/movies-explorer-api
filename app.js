const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const { PORT, MONGO_URL } = process.env;

const API_URL = process.env.NODE_ENV === 'production' ? '/' : '/api/';
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');

const router = require('./routes'); // импортируем роутеры

const app = express();

const NotFoundError = require('./errors/NotFoundError');
const { ERROR_NOTFOUND_MESSAGE } = require('./utils/constants');
const errorInternalServer = require('./middlewares/errorInternalServer');

const limiter = require('./middlewares/limiter');

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

// Слушаем 3000 порт
mongoose.connect(MONGO_URL || 'mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
});
// мидлвэр
app.use(helmet());
app.use(express.json());
app.use(cors);
//
app.use(requestLogger); // подключаем логгер запросов до всех обработчиков роутов
app.use(limiter);// подключаем rate-limiter

app.use(`${API_URL}`, router); // запускаем роутер
// errors
app.use(errorLogger); // подключаем логгер ошибок
app.use((req, res, next) => next(new NotFoundError(ERROR_NOTFOUND_MESSAGE)));

app.use(errors());// обработчик ошибок celebrate
app.use(errorInternalServer);

app.listen(PORT || 3001);
