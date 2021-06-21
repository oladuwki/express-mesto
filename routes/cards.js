const router = require('express').Router();
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

router.get('/', getCard);
router.post('/', validateCard, createCard);
router.delete('/:id', validateId, deleteCard);
router.put('/:id/likes', validateId, likeCard);
router.delete('/:id/likes', validateId, dislikeCard);

module.exports = router;