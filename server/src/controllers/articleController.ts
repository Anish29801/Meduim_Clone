import { Request, Response } from "express";
import prisma from "../prisma";

// GET all articles
export const getArticles = async (_req: Request, res: Response) => {
  try {
    const articles = await prisma.article.findMany({
      include: { author: true, category: true },
    });
    res.json(articles);
  } catch {
    res.status(500).json({ error: "Failed to fetch articles" });
  }
};

// GET single article
export const getArticle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const article = await prisma.article.findUnique({
      where: { id },
      include: { author: true, category: true },
    });
    if (!article) return res.status(404).json({ error: "Article not found" });
    res.json(article);
  } catch {
    res.status(500).json({ error: "Failed to fetch article" });
  }
};

// CREATE article
export const createArticle = async (req: Request, res: Response) => {
  try {
    const { title, content, coverImage, tags, categoryId, authorId } = req.body;
    const article = await prisma.article.create({
      data: { title, content, coverImage, tags, categoryId, authorId },
    });
    res.status(201).json(article);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE article
export const updateArticle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;
    const article = await prisma.article.update({ where: { id }, data });
    res.json(article);
  } catch {
    res.status(400).json({ error: "Failed to update article" });
  }
};

// DELETE article
export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.article.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(400).json({ error: "Failed to delete article" });
  }
};
