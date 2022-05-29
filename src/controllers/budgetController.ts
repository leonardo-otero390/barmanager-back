import { Request, Response } from 'express';
import * as budgetService from '../services/budgetService.js';
import * as eventCategoryService from '../services/eventCategoryService.js';
import * as emailService from '../services/emailService.js';

export async function create(req: Request, res: Response) {
  const { guests, cocktails, categoryId } = req.body;
  const { user } = res.locals;
  const budget = await budgetService.create({
    guests,
    cocktails,
    categoryId,
    customer: user,
  });
  await emailService.sendBudget(budget);
  return res.sendStatus(201);
}

export async function getCategories(req: Request, res: Response) {
  const categories = await eventCategoryService.findMany();
  return res.status(200).send(categories);
}
