import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import validateSchema from '../middlewares/validateSchema.js';
import { signUp, logIn } from '../schemas/customerSchema.js';

const authRouter = Router();

authRouter.post(
  '/sign-up',
  validateSchema(signUp, 'body'),
  authController.signUp
);

authRouter.post('/log-in', validateSchema(logIn, 'body'), authController.logIn);

export default authRouter;
