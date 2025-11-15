import { Router } from 'express';
import multer from 'multer';
import {
  createArticle,
  getArticles,
  getArticle,
  deleteArticle,
  getArticleCover,
  updateArticleController,
  getArticleStatus,
  toggleArticleStatus,
  getArticlesByAuthor,
  getArticlesByCategory,
  getArticlesByTag,
} from '../controllers/articleController';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// CATEGORY & TAG ROUTES FIRST
router.get('/category/:categoryId', getArticlesByCategory);
router.get('/tag/:tagId', getArticlesByTag);

// AUTHOR ROUTE
router.get('/author/:authorId', getArticlesByAuthor);

// ALL articles (search included)
router.get('/', getArticles);

// STATUS ROUTE
router.route('/:id/status').get(getArticleStatus).put(toggleArticleStatus);

// SINGLE article (must be below above special routes)
router.get('/:id', getArticle);

// COVER image
router.get('/:id/cover', getArticleCover);

// CREATE
router.post('/', upload.single('coverImage'), createArticle);

// UPDATE
router.patch('/:id', upload.single('coverImage'), updateArticleController);

// DELETE
router.delete('/:id', deleteArticle);

export default router;
