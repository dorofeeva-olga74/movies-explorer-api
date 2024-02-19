const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const { NODE_ENV, PORT, MONGO_URL } = process.env;

console.log(NODE_ENV); // production

const mongoose = require('mongoose');
const helmet = require('helmet');

const { errors } = require('celebrate');

// const bodyParser = require('body-parser');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const cors = require('./middlewares/cors');

const router = require('./routes'); // импортируем роутеры

const app = express();

const NotFoundError = require('./errors/NotFoundError');
const { ERROR_NOTFOUND_MESSAGE } = require('./utils/constants');

const errorInternalServer = require('./middlewares/errorInternalServer');

// Слушаем 3000 порт
mongoose
  .connect(MONGO_URL || 'mongodb://127.0.0.1:27017/bitfilmsdb', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // family: 4,
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch((error) => {
    console.log('Error connecting to MongoDB:', error);
  });

// Слушаем 3000 порт
// mongoose.connect(MONGO_URL || 'mongodb://localhost:27017/bitfilmsdb', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   family: 4,
// });
const limiter = require('./middlewares/limiter');

// мидлвэр
app.use(express.json());
// Логгер запросов нужно подключить до всех обработчиков роутов:
// app.use(cors({ origin: ['http://localhost:3000'] }));
// app.use(cors({ origin: ['http://localhost:3000'], methods: ['GET', 'POST'], credentials: true }));
// const corsOptions = {
//   origin: '*',
//   optionsSuccessStatus: 200,
// };
// app.use(cors(corsOptions));
// app.use(cors({ credentials: true, origin: true }));
app.use(cors);
// app.use(cors({ credentials: true, origin: true }));
// app.use(cors({ origin: ['http://localhost:3000'] }));
// app.options('*', cors());
app.use(requestLogger); // подключаем логгер запросов до всех обработчиков роутов
app.use(limiter);// подключаем rate-limiter
// ////////////// //////////////////////
// app.use(bodyParser.json()); // для собирания JSON-формата
// app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
app.use(helmet());
// //////////////////////////////////////
// const API_URL = process.env.NODE_ENV === 'production' ? '/' : '/api/';
// app.use(`${API_URL}`, router); // запускаем роутер
app.use('/', router); // запускаем роутер
// errors
app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());// обработчик ошибок celebrate
app.use((req, res, next) => {
  console.log('tut7');
  return next(new NotFoundError(ERROR_NOTFOUND_MESSAGE));
});
app.use(errorInternalServer);

// app.listen(PORT || 3001);
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
