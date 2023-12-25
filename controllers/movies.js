const Movie = require("../models/Movie.js");
const mongoose = require("mongoose");
const httpConstants = require("http2").constants;

const BadRequest = require("../errors/BadRequest.js");
const ForbiddenError = require("../errors/ForbiddenError.js");
const NotFoundError = require("../errors/NotFoundError.js");

module.exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find({ owner: req.user._id })
    return res.send(movies);
  } catch (next) {
    return next(err);
  }
};

module.exports.createMovie = async (req, res, next) => {
  const { country, director, duration, year, description, image,
    trailerLink, thumbnail, movieId, nameRU, nameEN } = req.body;
  // console.log(`country ${country}`)
  try {
    const newMovie = await Movie.create({country, director, duration, year, description, image,
      trailerLink, thumbnail, movieId, nameRU, nameEN, owner: req.user._id });
    return res.status(httpConstants.HTTP_STATUS_CREATED).send(await newMovie.save());
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequest("Переданы некорректные данные"));
    } else {
      return next(err);
    }
  }
}

module.exports.deleteMovie = async (req, res, next) => {
  const objectID = req.params.movieId;
  await Movie.findById(objectID)
    //.populate(["likes", "owner"])//???
    .orFail(() => {
      throw new NotFoundError("Фильм не найден");
    })
    .then((movie) => {
      const owner = movie.owner._id + '';
      //const owner = movie.owner.toString();
      if (req.user._id === owner) {
        Movie.deleteOne(movie)
            .then(() => {
            return res.status(httpConstants.HTTP_STATUS_OK).send(movie);
          })
          .catch(next);
      } else {
        return next(new ForbiddenError("Нет прав на удаление фильма"));
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequest("Передан не валидный id"));
      } else {
        return next(err);
      }
    });
};