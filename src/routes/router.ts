import { Router } from 'express';
import validateToken from '../middlewares/validateToken.js';

const routes = Router();

routes.get('/health', async (req, res) => {
  res.sendStatus(200);
});
routes.use(validateToken);

export default routes;
