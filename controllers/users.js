/* eslint-disable semi */
require('dotenv').config();
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const httpConstants = require('http2').constants;

const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const Conflict = require('../errors/Conflict');

// if (!Request.Headers.ContainsKey("Authorization"))
// {
//     Response.Headers["WWW-Authenticate"] = "Basic";
//     return AuthenticateResult.Fail("No contains header");
// }
const {
  ERROR_CONFLICT_MESSAGE,
  ERROR_NOTFOUND_MESSAGE_USER,
} = require('../utils/constants');

const User = require('../models/User');

const ERROR_CODE_DUPLICATE_MONGO = 11000; // вынесены магические числа
const SOLT_ROUNDS = 10; // хешируем пароль
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, SOLT_ROUNDS);
    const newUser = await User.create({ name, email, password: hash });
    return res.status(httpConstants.HTTP_STATUS_CREATED).send({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (err) {
    if (err.code === ERROR_CODE_DUPLICATE_MONGO) {
      return next(new Conflict(ERROR_CONFLICT_MESSAGE));
    }
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequest(ERROR_NOTFOUND_MESSAGE_USER));
    } return next(err);
  }
};
// module.exports.getCurrentUser = async (req, res, next) => {
//   try {
//     const currentUser = await User.findById(req.user._id);
//     if (!currentUser) {
//       throw new NotFoundError(ERROR_NOTFOUND_MESSAGE_USER);
//     } else {
//       return res.status(httpConstants.HTTP_STATUS_OK).send(currentUser);
//     }
//   } catch (err) {
//     return next(err);
//   }
// };

// module.exports.getCurrentUser = async (req, res, next) => {
//   try {
//     const currentUser = await User.findById(req.user._id)
//       .orFail(() => {
//         throw new NotFoundError(ERROR_NOTFOUND_MESSAGE_USER);
//       });
//     return res.status(httpConstants.HTTP_STATUS_OK).send(currentUser);
//   } catch (err) {
//     return next(err);
//   }
// };

// const { JWT_SECRET = 'some-secret-key' } = process.env;

// module.exports.getCurrentUser = async (req, res, next) => {
//   try {
//     // console.log(req.user);
//     const currentUser = await User.findById(req.user._id)
//       .orFail(() => {
//         console.log('tut3');
//         throw new NotFoundError(ERROR_NOTFOUND_MESSAGE_USER);
//       })
//     // console.log('tut4');
//     return res.status(httpConstants.HTTP_STATUS_OK).send(currentUser);
//     // console.log(`currUser: ${currentUser}`);
//     // if (!currentUser) {
//     //   console.log('tut3');
//     //   throw new NotFoundError(ERROR_NOTFOUND_MESSAGE_USER);
//     // } else {
//     //   console.log('tut4');
//     //   return res.status(httpConstants.HTTP_STATUS_OK).send(currentUser);
//     // }
//   } catch (err) {
//     // console.log('tut5');
//     if (err instanceof mongoose.Error.ValidationError) {
//       return next(new BadRequest(ERROR_NOTFOUND_MESSAGE_USER));
//     }
//     return next(err);
//   }
// };
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
  // const currentUser = await User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError(ERROR_NOTFOUND_MESSAGE_USER);
    })
    .then((currentUser) => res.status(httpConstants.HTTP_STATUS_OK).send(currentUser))
    // return res.status(httpConstants.HTTP_STATUS_OK).send(currentUser);
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest(ERROR_NOTFOUND_MESSAGE_USER));
      } else {
        next(err);
      }
    });
};
// Создайте контроллер и роут для получения информации о пользователе
// module.exports.getCurrentUser = async (req, res, next) => {
//   try {
//     const currentUser = await User.findById(req.user._id)
//       .orFail(() => {
//         throw new NotFoundError(ERROR_NOTFOUND_MESSAGE_USER);
//       });
//     return res.status(httpConstants.HTTP_STATUS_OK).send(currentUser);
//   } catch (err) {
//     return next(err);
//   }
// };

module.exports.updateUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const updateUser = await User.findByIdAndUpdate(req.user._id, { name, email }, { new: 'true', runValidators: 'true' });
    return res.status(httpConstants.HTTP_STATUS_OK).send(await updateUser.save());
  } catch (err) {
    if (err.code === ERROR_CODE_DUPLICATE_MONGO) {
      return next(new Conflict(ERROR_CONFLICT_MESSAGE));
    }
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequest(ERROR_NOTFOUND_MESSAGE_USER));
    }
    return next(err);
  }
};

// module.exports.updateUser = (req, res, next) => {
//   const { name, email } = req.body;
//   User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
//     .orFail(() => {
//       throw new NotFound(ERROR_404_MESSAGE_USER);
//     })
//     .then((updatedUser) => res.status(200).send(updatedUser))
//     .catch((err) => {
//       if (err.code === 11000) {
//         next(new Conflict(ERROR_409_MESSAGE_USER));
//       } else if (err.name === 'ValidationError') {
//         next(new BadRequest(ERROR_400_MESSAGE));
//       } else {
//         next(err);
//       }
//     });
// };

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '14d' });
    // const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
    //   expiresIn: ' 7d ',
    // });
    return res.status(httpConstants.HTTP_STATUS_OK).send({ token });
  } catch (err) {
    return next(err);
  }
};
