const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotAuthorizedError = require('../errors/NotAuthorizedError');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  Users.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  Users.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('No user with matching ID found');
    })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  Users.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        throw new ConflictError('User already exist!');
      }
      bcrypt
        .hash(password, 10)
        .then((hash) => Users.create({
          email,
          password: hash,
          name,
          about,
          avatar,
        }))
        .then((usr) => {
          if (!usr) throw new BadRequestError('Validation Error');
          return res.send({ data: usr });
        });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  Users.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('No user with matching ID found');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => next(err));
};
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  Users.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('No user with matching ID found');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => next(err));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return Users.findUserByCredentials(email, password)
    .then((user) => res.send({
      token: jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret',
        {
          expiresIn: '7d',
        },
      ),
    }))
    .catch((err) => {
      next(new NotAuthorizedError(err.message));
    });
};

module.exports.getUserByToken = (req, res, next) => {
  Users.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('No user with matching ID found');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => next(err));
};
