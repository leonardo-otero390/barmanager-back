import { Request, Response } from 'express';
import * as cocktailService from '../services/cocktailService.js';

export async function findMany(req: Request, res: Response) {
  const cocktails = await cocktailService.findMany();
  return res.send(cocktails);
}
