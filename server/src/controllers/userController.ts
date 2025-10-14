import { Request, Response } from "express";
import prisma from "../prisma";
import { createUser as registerUser, loginUser } from "../services/userService";

// ===== CRUD Routes =====

// GET all users
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// GET single user
export const getUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid user ID" });

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// UPDATE user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid user ID" });

    const data = req.body;
    const user = await prisma.user.update({ where: { id }, data });
    res.json(user);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message || "Failed to update user" });
  }
};

// DELETE user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid user ID" });

    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message || "Failed to delete user" });
  }
};

// ===== Auth Routes =====

// Signup
export const signup = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body); // accepts object now
    res.status(201).json(user);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);
    res.json(user);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};
