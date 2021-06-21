const cards = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

const ERROR_CODE_400 = 400;
const ERROR_CODE_404 = 404;

module.exports.getCard = (req, res, next) => {
  cards.find({})
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link, owner = req.user._id } = req.body;
  cards.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректный данные'));
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      }
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Невалидный id'));
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      }
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Невалидный id'));
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const owner = req.user._id;
  cards.findOneAndDelete({ _id: req.params.cardId, owner })
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      }
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Невалидный id'));
      }
      next(err);
    });
};