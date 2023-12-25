const mongoose = require('mongoose');
const validator = require('validator');
//const patternURL = /https?:\/\/(\w{3}\.)?[1-9a-z\-.]{1,}\w\w(\/[1-90a-z.,_@%&?+=~/-]{1,}\/?)?#?/i;

const movieSchema = new mongoose.Schema({
  country: {//страна создания фильма. Обязательное поле-строка.
    type: String, // — это строка
    required: true,// — обязательное поле
  },
  director:{//режиссёр фильма. Обязательное поле-строка.
    type: String, // — это строка
    required: true,// — обязательное поле
  },
  duration:{//длительность фильма. Обязательное поле-число
    type: Number, // — это число
    required: true,// — обязательное поле
  },
  year:{//год выпуска фильма. Обязательное поле-строка
    type: String, // — это строка
    required: true,// — обязательное поле
  },
  description:{// — описание фильма. Обязательное поле-строка.
    type: String, // — это строка
    required: true,// — обязательное поле
  },
  image:{//  — ссылка на постер к фильму. Обязательное поле-строка. Запишите её URL-адресом
    type: String, // — это строка
    required: true,// — обязательное поле
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Введите корректную ссылку',
    },
  },
  trailerLink:{//  — ссылка на трейлер фильма. Обязательное поле-строка. Запишите её URL-адресом
    type: String, // — это строка
    required: true,// — обязательное поле
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Введите корректную ссылку',
    },
  },
  thumbnail:{//  — миниатюрное изображение постера к фильму. Обязательное поле-строка. Запишите её URL-адресом.
    type: String, // — это строка
    required: true,// — обязательное поле
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Введите корректную ссылку',
    },
  },
  owner: {//— _id пользователя, который сохранил фильм. Обязательное поле.
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId:{// — id фильма, который содержится в ответе сервиса MoviesExplorer. Обязательное поле в формате number.
    type: Number, // — это число
    required: true,// — обязательное поле
  },
  nameRU:{// — название фильма на русском языке. Обязательное поле-строка.
    type: String, // — это строка
    required: true,// — обязательное поле
  },
  nameEN:{// — название фильма на английском языке. Обязательное поле-строка.
    type: String, // — это строка
    required: true,// — обязательное поле
  }
}, { versionKey: false });
// создаём модель и экспортируем её
module.exports = mongoose.model("movie", movieSchema);