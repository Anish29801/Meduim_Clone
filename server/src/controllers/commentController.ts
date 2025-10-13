import { Request, Response } from "express";
import prisma from "../prisma";

// GET all comments
export const getComments = async (_req: Request, res: Response) => {
  try {
    const comments = await prisma.comment.findMany({
      include: { article: true, user: true },
    });
    res.json(comments);
  } catch {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

// CREATE comment
export const createComment = async (req: Request, res: Response) => {
  try {
    const { content, articleId, userId, parentId } = req.body;
    const comment = await prisma.comment.create({
      data: { content, articleId, userId, parentId },
    });
    res.status(201).json(comment);
  } catch {
    res.status(400).json({ error: "Failed to create comment" });
  }
};

// UPDATE comment
export const updateComment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { content } = req.body;
    const comment = await prisma.comment.update({ where: { id }, data: { content } });
    res.json(comment);
  } catch {
    res.status(400).json({ error: "Failed to update comment" });
  }
};

// DELETE comment
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.comment.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(400).json({ error: "Failed to delete comment" });
  }
};
