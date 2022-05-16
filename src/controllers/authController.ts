import { Request, Response } from 'express';
import * as customerService from '../services/customerService.js';

export async function signUp(req: Request, res: Response) {
  await customerService.signUp(req.body);

  res.sendStatus(201);
}
