import { Router } from 'express';
import { uploadCoverImage } from '../controllers/uploadController';

const router = Router();

router.post('/', uploadCoverImage);

export default router;
