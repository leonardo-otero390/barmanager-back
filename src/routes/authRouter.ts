import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import validateSchema from '../middlewares/validateSchema.js';
import { signUp } from '../schemas/customerSchema.js';

const authRouter = Router();

authRouter.post(
  '/sign-up',
  validateSchema(signUp, 'body'),
  authController.signUp
);

export default authRouter;
