import { Request, Response } from "express";
import prisma from "../prisma";

/**
 * GET /api/comments
 * Optionally accepts ?articleId=#
 */
export const getComments = async (req: Request, res: Response) => {
  try {
    const articleId = req.query.articleId ? Number(req.query.articleId) : undefined;

    const whereClause = articleId ? { articleId } : {};

    const comments = await prisma.comment.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const formattedComments = comments.map((c) => ({
      id: c.id,
      content: c.content,
      articleId: c.articleId,
      userId: c.userId,
      createdAt: c.createdAt,
      userName: c.user.fullName || c.user.username,
    }));

    res.json(formattedComments);
  } catch (error) {
    console.error("❌ Failed to fetch comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

/**
 * POST /api/comments
 * Body: { content, articleId, userId, parentId? }
 */
export const createComment = async (req: Request, res: Response) => {
  try {
    const { content, articleId, userId, parentId } = req.body;

    if (!content || !articleId || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        articleId,
        userId,
        parentId: parentId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
    });

    res.status(201).json({
      id: comment.id,
      content: comment.content,
      articleId: comment.articleId,
      userId: comment.userId,
      createdAt: comment.createdAt,
      userName: comment.user.fullName || comment.user.username,
    });
  } catch (error) {
    console.error("❌ Failed to create comment:", error);
    res.status(400).json({ error: "Failed to create comment" });
  }
};

/**
 * PUT /api/comments/:id
 */
export const updateComment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { content } = req.body;

    const updated = await prisma.comment.update({
      where: { id },
      data: { content },
    });

    res.json(updated);
  } catch (error) {
    console.error("❌ Failed to update comment:", error);
    res.status(400).json({ error: "Failed to update comment" });
  }
};

/**
 * DELETE /api/comments/:id
 */
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.comment.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error("❌ Failed to delete comment:", error);
    res.status(400).json({ error: "Failed to delete comment" });
  }
};
