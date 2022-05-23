import { Request, Response } from 'express';
import * as budgetService from '../services/budgetService.js';

export async function create(req: Request, res: Response) {
  const { guests, cocktails } = req.body;
  const budget = await budgetService.create(guests, cocktails);
  return res.status(201).send({ budget });
}
