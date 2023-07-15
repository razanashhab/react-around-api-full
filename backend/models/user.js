const mongoose = require("mongoose");
const isEmail = require("validator/lib/isEmail");
const bcrypt = require("bcryptjs");

// write your code here
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => isEmail(v),
      message: "Wrong email format",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false, // add the select field
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: "Jacques Cousteau",
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: "Explorer",
  },
  avatar: {
    type: String,
    validate: {
      validator(v) {
        return /http[s]?:\/\/[www.]?[a-z1-9._~:/?%#[\]@!$&'()*+,;=]/.test(v);
      },
      message: "Error",
    },
    default:
      "https://practicum-content.s3.us-west-1.amazonaws.com/resources/moved_avatar_1604080799.jpg",
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        console.log("Incorrect password or email");
        return Promise.reject(new Error("Incorrect password or email"));
      }
      console.log(`password is ${password} - userPassword ${user}`);
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          console.log("Incorrect password or email");
          return Promise.reject(new Error("Incorrect password or email"));
        }
        console.log(user);
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
