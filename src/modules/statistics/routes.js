import { Router } from 'express';
import authMiddleware from '../../middlewares/auth-handler';
import * as controller from './controller';
const router = Router();

router.get('/', authMiddleware(['ROOT']), controller.getAnalyst);
export default router;
