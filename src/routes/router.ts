import { Router } from 'express';
import authRouter from './authRouter.js';
import cocktailRouter from './cocktailsRouter.js';

const routes = Router();

routes.get('/health', async (req, res) => {
  res.sendStatus(200);
});

routes.use(authRouter);

routes.use('/cocktails', cocktailRouter);

export default routes;
