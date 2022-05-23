import { Request, Response } from 'express';
import * as budgetService from '../services/budgetService.js';

export async function create(req: Request, res: Response) {
  const { guests, cocktails, categoryId } = req.body;
  const { user } = res.locals;
  const budget = await budgetService.create({
    guests,
    cocktails,
    categoryId,
    customerId: user.id,
  });
  return res.status(201).send({ budget });
}
