import { Router } from "express";
import { getTags } from "../controllers/tagController";

const router = Router();

// GET /api/tags
router.get("/", getTags);

export default router;
