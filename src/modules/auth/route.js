import * as controller from './controller';
import { Router } from 'express';
import * as validation from '../users/validation';
import authMiddleware from '../../middlewares/auth-handler';

const router = Router();

router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.put('/password', authMiddleware(), controller.updatePassword);
router.post('/create', authMiddleware(['ROOT']), controller.createAdmin);
export default router;
