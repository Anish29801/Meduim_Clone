import { Router } from "express";
import {
  getUsers,
  signup,
  login,
  getUser,
  updateUser,
  deleteUser,
  getUserNameAndImage,
} from "../controllers/userController";

const router = Router();

// Auth
router.post("/signup", signup);
router.post("/login", login);

// ✅ Custom route for author name & image
router.get("/info/:id", getUserNameAndImage);

// CRUD
router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
