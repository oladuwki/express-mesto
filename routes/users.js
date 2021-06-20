const routerUsers = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().length(24).hex(),
  }),
});

const validateUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const validateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .required()
      .regex(/^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w\W.-]*)#?$/),
  }),
});

const {
  getUsers, getUser, createUser, updateProfile, updateAvatar,
} = require('../controllers/users');

routerUsers.get('/users', getUsers);
routerUsers.get('/users/:userId', validateId, getUser);
routerUsers.post('/users', createUser);
routerUsers.patch('/users/me', validateUpdateProfile, updateProfile);
routerUsers.patch('/users/me/avatar', validateAvatar, updateAvatar);

module.exports = routerUsers;