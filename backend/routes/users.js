const router = require("express").Router();
const {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
  getUserByToken,
  login,
} = require("../controllers/users");
const { celebrate, Joi } = require("celebrate");
const { validateURL } = require("../utils/validator");

router.get("/users", getUsers);

router.get("/users/:userId", getUser);

router.post(
  "/users",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
      avatar: Joi.string().custom(validateURL),
    }),
  }),
  createUser
);

router.patch("/users/me", updateProfile);

router.patch("/users/me/avatar", updateAvatar);

router.get("/users/me", getUserByToken);

router.post("/signin", login);

router.post("/signup", createUser);

module.exports = router;
