/* eslint-disable newline-per-chained-call */
import Joi from 'joi';

export const request = Joi.object({
  guests: Joi.number().required(),
  eventCategory: Joi.string().required(),
  cocktails: Joi.array().items(Joi.number()).min(1).max(4).required(),
});
