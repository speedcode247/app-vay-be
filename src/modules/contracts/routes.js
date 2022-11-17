import { Router } from 'express';
import authMiddleware from '../../middlewares/auth-handler';
import * as controller from './controller';
import config from '../../app.config';
import * as validator from './validation';
const router = Router();

router.get(
  '/all',
  authMiddleware([config.app.role[1], config.app.role[2]]),
  controller.getAllContracts
);
router.post('/', authMiddleware(), controller.createContract);
router.get('/', authMiddleware(), controller.userGetContracts);
router.put(
  '/:_id/confirm',
  authMiddleware([config.app.role[1], config.app.role[2]]),
  controller.confirmContract
);
router.put(
  '/:_id',
  authMiddleware([config.app.role[1], config.app.role[2]]),
  validator.admin_async_validator,
  controller.updateContract
);

router.get('/:_id', authMiddleware(), controller.getById);

export default router;
