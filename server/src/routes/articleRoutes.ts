import { Router } from 'express';
import {
  createArticle,
  getArticle,
  deleteArticle,
  getArticleCover,
} from '../controllers/articleController';

const router = Router();

router.post('/', createArticle);
router.get('/:id', getArticle);
router.get('/:id/cover', getArticleCover); // serve image
router.delete('/:id', deleteArticle);

export default router;
