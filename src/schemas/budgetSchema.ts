/* eslint-disable newline-per-chained-call */
import Joi from 'joi';

export const request = Joi.object({
  guests: Joi.number().required(),
  categoryId: Joi.number().required(),
  cocktails: Joi.array().items(Joi.number()).min(1).max(4).required(),
});
