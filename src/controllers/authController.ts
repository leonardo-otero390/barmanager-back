import { Request, Response } from 'express';
import * as customerService from '../services/customerService.js';

export async function signUp(req: Request, res: Response) {
  await customerService.signUp(req.body);

  res.sendStatus(201);
}

export async function logIn(req: Request, res: Response) {
  const token = await customerService.logIn(req.body);

  res.send(token);
}
