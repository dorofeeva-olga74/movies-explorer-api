// создадим express router
const movieRouter = require('express').Router();
const { errors } = require('celebrate');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { createMovieValidator, deleteMovieValidator } = require('../middlewares/validation');

// Здесь роутинг
movieRouter.get('/', getMovies);

movieRouter.post('/', createMovieValidator, createMovie);

movieRouter.delete('/:movieId', deleteMovieValidator, deleteMovie);

movieRouter.use(errors()); // обработчик ошибок celebrate

module.exports = movieRouter; // экспортировали роутер
