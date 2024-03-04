const httpConstants = require('http2').constants;
const mongoose = require('mongoose');

const { error } = require('console');

const BadRequest = require('../errors/BadRequest');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

const {
  ERROR_BADREQUEST_MESSAGE,
  ERROR_NOTFOUND_MESSAGE_MOVIE,
  ERROR_FORBIDDEN_MESSAGE_MOVIE,
  ERROR_NOTFOUND_MESSAGE_USER,
} = require('../utils/constants');

const Movie = require('../models/Movie');

module.exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find({ owner: req.user._id });
    return res.send(movies);
  } catch (next) {
    return next(error);
  }
};

// eslint-disable-next-line consistent-return
module.exports.createMovie = async (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  // console.log(req.body)
    // console.log(`req: ${req}`);
    // console.log(`req.user._id: ${req.user._id}`);
  try {
    const newMovie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
      owner: req.user._id,
    });
    return res.status(httpConstants.HTTP_STATUS_CREATED).send(await newMovie.save());
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequest(ERROR_NOTFOUND_MESSAGE_USER));
    } return next(error);
  }
};

// module.exports.deleteMovie = (req, res, next) => {
//   const objectID = req.params.movieId;
//   console.log(objectID);
//   Movie.findById(objectID)
//     .orFail(() => {
//       throw new NotFoundError(ERROR_NOTFOUND_MESSAGE_MOVIE);
//     })
//     .then((movie) => {
//       const owner = movie.owner.toString();
//       console.log(owner);
//       console.log(req.user._id);
//       if (req.user._id === owner) {
//         console.log('tut');
//         console.log(movie);
//         Movie.deleteOne(movie);
//         return res.status(httpConstants.HTTP_STATUS_OK).send(movie);
//       } return next(new ForbiddenError(ERROR_FORBIDDEN_MESSAGE_MOVIE));
//     })
//     .catch((err) => {
//       console.log('error');
//       if (err.name === CAST_ERROR) {
//         return next(new BadRequest(ERROR_BADREQUEST_MESSAGE));
//       } return next(error);
//     });
// };

module.exports.deleteMovie = (req, res, next) => {
  const objectID = req.params.movieId;
  // console.log(objectID)
  Movie.findById(objectID)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(ERROR_NOTFOUND_MESSAGE_MOVIE);
      }
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError(ERROR_FORBIDDEN_MESSAGE_MOVIE);
      }
      Movie.deleteOne(movie)
        .then(() => {
          res
            .status(httpConstants.HTTP_STATUS_OK)
            .send(movie);
        })
        .catch((err) => {
          if (err instanceof mongoose.Error.DocumentNotFoundError) {
            next(new NotFoundError(ERROR_NOTFOUND_MESSAGE_MOVIE));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequest(ERROR_BADREQUEST_MESSAGE));
      } else {
        next(err);
      }
    });
};
