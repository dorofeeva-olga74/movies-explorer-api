const { Joi, celebrate } = require('celebrate');
//const patternURL = /https?:\/\/(\w{3}\.)?[1-9a-z\-.]{1,}\w\w(\/[1-90a-z.,_@%&?+=~/-]{1,}\/?)?#?/i;
const patternURL = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

const updateUserValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
  name: Joi.string().required().min(2).max(30),
  email: Joi.string().required().email(),
  }),
});

const loginValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const createUserValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const getCurrentUserValidator = celebrate({
     // валидируем параметры
    params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
    }),
  });

const createMovieValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    //image: Joi.string().required().uri(),
    image: Joi.string().required().pattern(patternURL),
    //trailerLink: Joi.string().required().uri(),
    trailerLink: Joi.string().required().pattern(patternURL),
    //thumbnail: Joi.string().required().uri(),
    thumbnail: Joi.string().required().pattern(patternURL),
    movieId: Joi.number().required(),
    //owner:mongoose.Schema.Types.ObjectId().ref().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const deleteMovieValidator = celebrate({ //movies/cardId
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  updateUserValidator,
  loginValidator,
  createUserValidator,
  getCurrentUserValidator,
  createMovieValidator,
  deleteMovieValidator,
}