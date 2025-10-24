import { Request, Response } from 'express';
import prisma from '../prisma';
import { createArticleService } from '../services/articleService';

// GET all articles
export const getArticles = async (_req: Request, res: Response) => {
  try {
    const articles = await prisma.article.findMany({
      include: {
        author: true,
        category: true,
        tags: { select: { id: true, name: true } },
      },
    });
    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
};

// GET single article
export const getArticle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        author: true,
        category: true,
        tags: { select: { id: true, name: true } },
      },
    });
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
};

// CREATE article
export const createArticle = async (req: Request, res: Response) => {
  try {
    const article = await createArticleService(req.body);
    res.json(article);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// UPDATE article
export const updateArticle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { title, content, coverImage, tags, categoryId } = req.body;

    const article = await prisma.article.update({
      where: { id },
      data: {
        title,
        content,
        coverImage,
        categoryId,
        tags: tags?.length
          ? {
              set: [], // remove existing tags
              connectOrCreate: tags.map((tag: string) => ({
                where: { name: tag },
                create: { name: tag },
              })),
            }
          : undefined,
      },
      include: { tags: { select: { id: true, name: true } } },
    });

    res.json(article);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// DELETE article
export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.article.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to delete article' });
  }
};
