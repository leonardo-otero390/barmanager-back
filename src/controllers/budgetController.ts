import { Request, Response } from 'express';
import * as budgetService from '../services/budgetService.js';
import * as eventCategoryService from '../services/eventCategoryService.js';

export async function create(req: Request, res: Response) {
  const { guests, cocktails, categoryId } = req.body;
  const { user } = res.locals;
  const budget = await budgetService.create({
    guests,
    cocktails,
    categoryId,
    customer: user,
  });
  return res.status(201).send(budget);
}

export async function getCategories(req: Request, res: Response) {
  const categories = await eventCategoryService.findMany();
  return res.status(200).send(categories);
}
