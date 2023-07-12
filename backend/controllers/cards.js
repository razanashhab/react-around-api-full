const Cards = require("../models/card");
const { NotFoundError } = require("../errors/NotFoundError");

module.exports.getCards = (req, res) => {
  Cards.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Cards.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.deleteCard = (req, res) => {
  Cards.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError("No card found with that id");
    })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.likeACard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError("No card found with that id");
    })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.unlikeACard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError("No card found with that id");
    })
    .then((card) => res.send({ data: card }))
    .catch(next);
};
