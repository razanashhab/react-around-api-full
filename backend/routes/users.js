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

router.get("/users/me", getUserByToken);

// router.get("/users", getUsers);

// router.get(
//   "/users/:userId",
//   celebrate({
//     params: Joi.object().keys({
//       userId: Joi.string().alphanum(),
//     }),
//   }),
//   getUser
// );

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

router.patch(
    "/users/me",
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required().min(2).max(30),
            about: Joi.string().required().min(2).max(30),
            avatar: Joi.string().custom(validateURL),
        }),
    }),
    updateProfile
);

router.patch(
    "/users/me/avatar",
    celebrate({
        body: Joi.object().keys({
            avatar: Joi.string().custom(validateURL),
        }),
    }),
    updateAvatar
);

router.post(
    "/signin",
    celebrate({
        body: Joi.object().keys({
            email: Joi.string().required().email(),
            password: Joi.string().required().min(8),
        }),
    }),
    login
);

router.post(
    "/signup",
    celebrate({
        body: Joi.object().keys({
            email: Joi.string().required().email(),
            password: Joi.string().required().min(8),
        }),
    }),
    createUser
);

module.exports = router;