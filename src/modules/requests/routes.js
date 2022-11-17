import { Router } from 'express';
import authMiddleware from '../../middlewares/auth-handler';
import * as controller from './controller';
import config from '../../app.config';

const router = Router();
router.get(
  '/all',
  authMiddleware([config.app.role[1], config.app.role[2]]),
  controller.getAll
);

router.get('/', authMiddleware(), controller.userGetRequest);

router.post('/', authMiddleware(), controller.createRequest);

router.get('/lasted', authMiddleware(), controller.getLastRequest);

router.post('/verify', authMiddleware(), controller.verifyOtpAndUpdateRequest);

router.put(
  '/:id/change',
  authMiddleware([config.app.role[1], config.app.role[2]]),
  controller.updateRequest
);
router.put(
  '/:_id',
  authMiddleware([config.app.role[1], config.app.role[2]]),
  controller.updateStatus
);

export default router;
