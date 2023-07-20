const router = require("express").Router();
const {
    getCards,
    createCard,
    deleteCard,
    likeACard,
    unlikeACard,
} = require("../controllers/cards");
const { celebrate, Joi } = require("celebrate");
const { validateURL } = require("../utils/validator");

router.post(
    "/cards",
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required().min(2).max(30),
            link: Joi.string().custom(validateURL),
        }),
    }),
    createCard
);

router.delete(
    "/cards/:cardId",
    celebrate({
        params: Joi.object().keys({
            cardId: Joi.string().alphanum().length(24),
        }),
    }),
    deleteCard
);

router.put(
    "/cards/likes/:cardId",
    celebrate({
        params: Joi.object().keys({
            cardId: Joi.string().alphanum(),
        }),
    }),
    likeACard
);

router.delete(
    "/cards/likes/:cardId",
    celebrate({
        params: Joi.object().keys({
            cardId: Joi.string().alphanum(),
        }),
    }),
    unlikeACard
);

router.get("/cards", getCards);

module.exports = router;