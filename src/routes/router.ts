import { Router } from 'express';
import authRouter from './authRouter.js';
import cocktailRouter from './cocktailsRouter.js';
import budgetRouter from './budgetRouter .js';

const routes = Router();

routes.get('/health', async (req, res) => {
  res.sendStatus(200);
});

routes.use(authRouter);

routes.use('/cocktails', cocktailRouter);

routes.use('/budget', budgetRouter);

export default routes;
