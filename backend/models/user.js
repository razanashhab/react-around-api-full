const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');
const passportLocalMongoose = require('passport-local-mongoose');
const { NotAuthorizedError } = require('../errors/NotAuthorizedError');

// write your code here
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Wrong email format',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Jacques Cousteau',
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Explorer',
  },
  avatar: {
    type: String,
    validate: {
      validator(v) {
        return /http[s]?:\/\/[www.]?[a-z1-9._~:/?%#[\]@!$&'()*+,;=]/.test(v);
      },
      message: 'Error',
    },
    default:
      'https://practicum-content.s3.us-west-1.amazonaws.com/resources/moved_avatar_1604080799.jpg',
  },
});

userSchema.plugin(passportLocalMongoose, {
  selectFields: 'email name about avatar',
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new NotAuthorizedError('Incorrect password or email'),
        );
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new NotAuthorizedError('Incorrect password or email'),
          );
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
