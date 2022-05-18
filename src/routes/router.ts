import { Router } from 'express';
import validateToken from '../middlewares/validateToken.js';
import authRouter from './authRouter.js';
import cocktailRouter from './cocktailsRouter.js';

const routes = Router();

routes.get('/health', async (req, res) => {
  res.sendStatus(200);
});

routes.use(authRouter);

routes.use('/cocktails', cocktailRouter);

routes.use(validateToken);

export default routes;
