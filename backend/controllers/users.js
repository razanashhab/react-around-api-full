const Users = require("../models/user");
const { NotFoundError } = require("../errors/NotFoundError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res) => {
  Users.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUser = (req, res) => {
  Users.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError("No user with matching ID found");
    })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.createUser = (req, res) => {
  const { email, password, name, about, avatar } = req.body;
  console.log(`${email} ${password}`);
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      Users.create({
        email,
        password: hash,
        name,
        about,
        avatar,
      })
    )
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  Users.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new NotFoundError("No user with matching ID found");
    })
    .then((user) => res.send({ data: user }))
    .catch(next);
};
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  Users.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new NotFoundError("No user with matching ID found");
    })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return Users.findUserByCredentials(email, password)
    .then((user) => {
      console.log(
        `token is ${jwt.sign(
          { _id: user._id },
          NODE_ENV === "production" ? JWT_SECRET : "super-strong-secret",
          {
            expiresIn: "7d",
          }
        )}`
      );
      res.send({
        token: jwt.sign(
          { _id: user._id },
          NODE_ENV === "production" ? JWT_SECRET : "super-strong-secret",
          {
            expiresIn: "7d",
          }
        ),
      });
    })
    .catch(next);
};

module.exports.getUserByToken = (req, res) => {
  Users.findById(req.params.user._id)
    .orFail(() => {
      throw new NotFoundError("No user with matching ID found");
    })
    .then((user) => res.send({ data: user }))
    .catch(next);
};
