import { Router } from 'express';
import authMiddleware from '../../middlewares/auth-handler';
import * as controller from './controller';
import config from '../../app.config';

const router = Router();
router.get('/', authMiddleware(), controller.userGetPayment);
router.get(
  '/:id',
  authMiddleware([config.app.role[1], config.app.role[2]]),
  controller.adminGetPayment
);
export default router;
