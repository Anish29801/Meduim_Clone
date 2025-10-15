import { Router } from "express";
import { getUsers,signup,login,getUser,updateUser, deleteUser } from "../controllers/userController";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", signup);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
