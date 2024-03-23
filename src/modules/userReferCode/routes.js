import { Router } from 'express';
import authMiddleware from '../../middlewares/auth-handler';
import * as controller from './controller';
import config from '../../app.config';
// import * as validator from './validation';
const router = Router();

router.get(
  '/',
  authMiddleware([config.app.role[1], config.app.role[2], config.app.role[3]]),
  controller.getReferCodeList
);

router.post(
  '/',
  authMiddleware([config.app.role[2]]),
  controller.addNewReferCode
);

router.delete(
  '/:id',
  authMiddleware([config.app.role[2]]),
  controller.removeReferCode
);
export default router;
