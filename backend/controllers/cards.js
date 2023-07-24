const Cards = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Cards.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Cards.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};

module.exports.deleteCard = (req, res, next) => {
  Cards.findById(req.params.cardId)
    .then((card) => {
      if (req.user._id !== card.owner) throw new ForbiddenError('Forbidden action!');

      Cards.findByIdAndRemove(req.params.cardId).orFail(() => {
        throw new NotFoundError('No card found with that id');
      });
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};

module.exports.likeACard = (req, res, next) => {
  Cards.findByIdAndUpdate(req.params.cardId, {
    $addToSet: { likes: req.user._id },
  }, { new: true })
    .orFail(() => {
      throw new NotFoundError('No card found with that id');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};

module.exports.unlikeACard = (req, res, next) => {
  Cards.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      throw new NotFoundError('No card found with that id');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};
