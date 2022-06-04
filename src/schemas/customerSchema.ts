import Joi from 'joi';

export const signUp = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().length(11).allow(''),
  password: Joi.string().required(),
});

export const logIn = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
