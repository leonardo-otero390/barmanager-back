import { Request, Response } from 'express';
import * as cocktailService from '../services/cocktailService.js';

export function findMany(req: Request, res: Response) {
  const cocktails = cocktailService.findMany();
  return res.send(cocktails);
}
