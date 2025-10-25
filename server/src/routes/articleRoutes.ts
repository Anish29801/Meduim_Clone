import { Router } from 'express';
import multer from 'multer';
import {
  createArticle,
  getArticles,
  getArticle,
  deleteArticle,
  getArticleCover,
} from '../controllers/articleController';

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

// Routes
router.get('/', getArticles);
router.get('/:id', getArticle);
router.get('/:id/cover', getArticleCover);
router.post('/', upload.single('coverImage'), createArticle);

// DELETE article
router.delete('/:id', deleteArticle);

export default router;
