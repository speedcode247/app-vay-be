import { Router } from 'express';
import authMiddleware from '../../middlewares/auth-handler';
import * as controller from './controller';
import config from '../../app.config';
import * as validator from './validation';
const router = Router();

router.get(
  '/getAllNote',
  authMiddleware(),
  controller.getAllNote
);
router.post('/updateAllNote', authMiddleware([config.app.role[1], config.app.role[2], config.app.role[3]]), controller.updateAllNote);

export default router;
