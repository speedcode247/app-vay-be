import { Router } from 'express';
import authMiddleware from '../../middlewares/auth-handler';
import * as controller from './controller';
import config from '../../app.config';
const router = Router();

router.get('/all', authMiddleware(), controller.getAll);
router.get('/', controller.getInfo);
router.post(
  '/',
  authMiddleware([config.app.role[1], config.app.role[2]]),
  controller.create
);

router.put(
  '/:_id',
  authMiddleware([config.app.role[1], config.app.role[2]]),
  controller.updateInfo
);
router.post(
  '/:_id',
  authMiddleware([config.app.role[1], config.app.role[2]]),
  controller.toggle
);
router.delete(
  '/:_id',
  authMiddleware([config.app.role[1], config.app.role[2]]),
  controller.deleteItem
);

export default router;
