import { Router } from 'express';
import * as cocktailController from '../controllers/cocktailController.js';

const cocktailRouter = Router();

cocktailRouter.get('/', cocktailController.findMany);

export default cocktailRouter;
