import { Request, Response } from "express";
import prisma from "../prisma";

// GET all users
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// GET single user
export const getUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// CREATE user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, fullName, bio, avatar, gender, isAdmin } = req.body;
    const user = await prisma.user.create({
      data: { username, email, password, fullName, bio, avatar, gender, isAdmin },
    });
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;
    const user = await prisma.user.update({ where: { id }, data });
    res.json(user);
  } catch {
    res.status(400).json({ error: "Failed to update user" });
  }
};

// DELETE user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(400).json({ error: "Failed to delete user" });
  }
};
