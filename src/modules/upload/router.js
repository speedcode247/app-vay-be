import { Router } from 'express';
const fileUploader = require('../../cloudinary.config');
import upload from './controller';
import middleware from '../../middlewares/auth-handler';
const router = Router();

router.post('/', middleware(), fileUploader.single('file'), upload);

export default router;
