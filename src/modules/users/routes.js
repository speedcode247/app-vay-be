import { Router } from 'express';
import authMiddleware from '../../middlewares/auth-handler';
import * as controller from './controller';
import config from '../../app.config';

const router = Router();

router.get('/checkId', authMiddleware(), controller.checkIdUser);
router.get('/sign-zalo', authMiddleware(), controller.signWentToZalo);
router.get(
  '/admin',
  authMiddleware([config.app.role[2]]),
  controller.getAllAdmin
);
router.post('/init', authMiddleware(), controller.updateProfile);
router.get('/profile', authMiddleware(), controller.getProfile);
router.put('/profile/avatar', authMiddleware(), controller.updateAvatar);
router.put('/password', authMiddleware(), controller.updatePassword);
router.post(
  '/verify',
  authMiddleware([config.app.role[0]]),
  controller.requestVerify
);
//
router.get(
  '/search',
  authMiddleware([config.app.role[1], config.app.role[2]]),
  controller.searchUser
);
router.post(
  '/transfer',
  authMiddleware([config.app.role[1], config.app.role[2]]),
  controller.transferZalo
);
router.put(
  '/supporter',
  authMiddleware([config.app.role[1], config.app.role[2]]),
  controller.updateSupporter
);
router.post(
  '/export',
  authMiddleware([config.app.role[1], config.app.role[2]]),
  controller.exportUser
);

router.get(
  '/',
  authMiddleware([config.app.role[1], config.app.role[2]]),
  controller.getAllUsers
);
router.put(
  '/toggle-activity',
  authMiddleware([config.app.role[2]]),
  controller.toggleActivity
);
router.put(
  '/:userId/verify',
  authMiddleware([config.app.role[2]]),
  controller.confirmVerify
);

router.post(
  '/:id',
  authMiddleware([config.app.role[2]]),
  controller.updateBalance
);
router.put(
  '/:id/login-phone',
  authMiddleware([config.app.role[2]]),
  controller.changeLoginPhone
);
router.put(
  '/:_id',
  authMiddleware([config.app.role[2]]),
  controller.updateUserFromAdmin
);

router.get(
  '/:id',
  authMiddleware([config.app.role[1], config.app.role[2]]),
  controller.adminGetAllInfoUser
);
router.delete(
  '/:id',
  authMiddleware([config.app.role[2]]),
  controller.deleteUser
);

export default router;
