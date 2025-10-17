import { Router } from "express";
import { getUsers, signup, login, getUser, updateUser, deleteUser } from "../controllers/userController";

const router = Router();

// Auth
router.post("/signup", signup);
router.post("/login", login);

// CRUD
router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
