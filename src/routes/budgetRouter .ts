import { Router } from 'express';
import * as budgetController from '../controllers/budgetController.js';
import * as budgetSchema from '../schemas/budgetSchema.js';
import validateSchema from '../middlewares/validateSchema.js';
import validateToken from '../middlewares/validateToken.js';

const budgetRouter = Router();

budgetRouter.get('/categories', budgetController.getCategories);

budgetRouter.use(validateToken);

budgetRouter.post(
  '/',
  validateSchema(budgetSchema.request, 'body'),
  budgetController.create
);

export default budgetRouter;
