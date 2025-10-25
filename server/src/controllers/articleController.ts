import { Request, Response } from 'express';
import prisma from '../prisma';
import {
  CreateArticleData,
  createArticleService,
} from '../services/articleService';

// ✅ multer middleware ke sath
export const createArticle = async (req: Request, res: Response) => {
  try {
    const { title, content, categoryId, authorId, tags } = req.body;

    if (!req.file) throw new Error('Cover image required');
    const fileBuffer: Buffer = req.file.buffer;

    // multer memoryStorage se buffer
    const myUint8Array: Uint8Array<ArrayBuffer> = new Uint8Array(fileBuffer);

    const coverBytes = myUint8Array;

    const article = await createArticleService({
      title,
      content,
      categoryId: Number(categoryId),
      authorId: Number(authorId),
      tags: JSON.parse(tags || '[]'), // tags as JSON array
      coverImageBytes: coverBytes,
    });

    res.status(201).json(article);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

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

// Serve cover image as binary
export const getArticleCover = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const article = await prisma.article.findUnique({ where: { id } });
    if (!article || !article.coverImageBytes) return res.sendStatus(404);

    res.setHeader('Content-Type', 'image/png');
    res.send(article.coverImageBytes); // ✅ Uint8Array works
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

// DELETE article
export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.article.delete({ where: { id } });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to delete article' });
  }
};
