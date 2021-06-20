const routerCards = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCard, createCard, likeCard, dislikeCard, deleteCard,
} = require('../controllers/cards');

const validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string()
      .required()
      .regex(/^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w\W.-]*)#?$/),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().length(24).hex(),
  }),
});

routerCards.get('/cards', getCard);
routerCards.post('/cards', validateCard, createCard);
routerCards.delete('/cards/:cardId', validateId, deleteCard);
routerCards.put('/cards/:cardId/likes', validateId, likeCard);
routerCards.delete('/cards/:cardId/likes', validateId, dislikeCard);

module.exports = routerCards;