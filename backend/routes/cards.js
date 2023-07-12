const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeACard,
  unlikeACard,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', createCard);

router.delete('/cards/:cardId', deleteCard);

router.put('/cards/:cardId/likes', likeACard);

router.delete('/cards/:cardId/likes', unlikeACard);

module.exports = router;
