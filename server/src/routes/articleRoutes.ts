import { Router } from "express";
import multer from "multer";
import {
  createArticle,
  getArticles,
  getArticle,
  deleteArticle,
  getArticleCover,
  updateArticle,getArticleStatus,
  toggleArticleStatus,
  getArticlesByAuthor,
} from "../controllers/articleController";

const router = Router();

// ✅ Setup multer for image upload
const upload = multer({ storage: multer.memoryStorage() });

// =======================
// ✅ Routes
// =======================

// ✅ Get all articles
router.get("/", getArticles);
router.route("/:id/status")
  .get(getArticleStatus)
  .put(toggleArticleStatus);

// ✅ Get articles by author (important: must be before `/:id`)
router.get("/author/:authorId", getArticlesByAuthor);

// ✅ Get single article by ID
router.get("/:id", getArticle);

// ✅ Get article cover image
router.get("/:id/cover", getArticleCover);

// ✅ Create article
router.post("/", upload.single("coverImage"), createArticle);

// ✅ Update article
router.patch("/:id", upload.single("coverImage"), updateArticle);

// ✅ Delete article
router.delete("/:id", deleteArticle);

export default router;
