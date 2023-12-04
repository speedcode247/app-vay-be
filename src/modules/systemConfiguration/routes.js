import { Router } from 'express';
import authMiddleware from '../../middlewares/auth-handler';
import * as controller from './controller';
import config from '../../app.config';

const router = Router();

router.get('/getSystemConfig', authMiddleware(), controller.getSystemConfig);
router.get('/admin/getSystemConfig', authMiddleware([config.app.role[1],config.app.role[2]]), controller.adminGetSystemConfig);
router.post('/admin/updateConfig', authMiddleware([config.app.role[1],config.app.role[2]]), controller.adminUpdateConfig);

export default router;
