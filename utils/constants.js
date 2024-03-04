const ERROR_BADREQUEST_MESSAGE = 'Переданы некорректные данные'; // 400
const ERROR_CONFLICT_MESSAGE = 'Пользователь уже существует'; // 409
const ERROR_FORBIDDEN_MESSAGE_MOVIE = 'Нет прав на удаление фильма'; // 403
const ERROR_NOTFOUND_MESSAGE = 'Страница не найдена'; // 404
const ERROR_NOTFOUND_MESSAGE_MOVIE = 'Фильм не найден'; // 404
const ERROR_NOTFOUND_MESSAGE_USER = 'Переданы некорректные данные'; // 404
const ERROR_UNAUTHORIZED_MESSAGE = 'Необходима авторизация'; // 401

const ERROR_SERVER_MESSAGE = 'На сервере произошла ошибка'; // 500
const DELLETE_MESSAGE = 'Фильм удален';
const INVALID_URL = 'Введите корректную ссылку';
const INVALID_EMAIL = 'Введите корректный email';
const INVALID_EMAIL_OR_PASSWORD = 'Неправильные почта или пароль';
const MIN_LENGTH = 'Mинимальная длина  — 2 символа';
const MAX_LENGTH = 'Максимальная длина— 30 символов';
const CAST_ERROR = 'CastError';

module.exports = {
  ERROR_BADREQUEST_MESSAGE,
  ERROR_CONFLICT_MESSAGE,
  ERROR_FORBIDDEN_MESSAGE_MOVIE,
  ERROR_NOTFOUND_MESSAGE,
  ERROR_NOTFOUND_MESSAGE_MOVIE,
  ERROR_NOTFOUND_MESSAGE_USER,
  ERROR_UNAUTHORIZED_MESSAGE,
  DELLETE_MESSAGE,
  ERROR_SERVER_MESSAGE,
  INVALID_URL,
  INVALID_EMAIL,
  INVALID_EMAIL_OR_PASSWORD,
  MIN_LENGTH,
  MAX_LENGTH,
  CAST_ERROR,
};
