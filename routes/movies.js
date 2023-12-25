// создадим express router
const movieRouter = require("express").Router();
const { getMovies, createMovie, deleteMovie } = require("../controllers/movies.js");
const { createMovieValidator, deleteMovieValidator } = require("../middlewares/validation.js");
//const { errors } = require("celebrate");

// Здесь роутинг
movieRouter.get("/", getMovies);

movieRouter.post("/", createMovieValidator, createMovie);

movieRouter.delete("/:movieId", deleteMovieValidator, deleteMovie);

//movieRouter.use(errors());// обработчик ошибок celebrate
// экспортируем его
module.exports = movieRouter; // экспортировали роутер