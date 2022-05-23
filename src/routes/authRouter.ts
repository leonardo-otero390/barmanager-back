import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import validateSchema from '../middlewares/validateSchema.js';
import { signUp, logIn } from '../schemas/customerSchema.js';

const authRouter = Router();

authRouter.post(
  '/signup',
  validateSchema(signUp, 'body'),
  authController.signUp
);

authRouter.post('/login', validateSchema(logIn, 'body'), authController.logIn);

export default authRouter;
