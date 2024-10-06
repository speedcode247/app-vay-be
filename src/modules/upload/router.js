import { Router } from 'express';

import upload from './controller';
import middleware from '../../middlewares/auth-handler';
import uploadCloud from '../../cloudinary.config';
const router = Router();

router.post('/', middleware(), uploadCloud, upload);

export default router;
