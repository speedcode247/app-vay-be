import * as controller from './controllers';
import { Router } from 'express';
import middleware from '../../middlewares/auth-handler';
const router = Router();

router.get('/', middleware(), controller.getNotifications);
router.post('/:id', middleware(), controller.seen);
export default router;
