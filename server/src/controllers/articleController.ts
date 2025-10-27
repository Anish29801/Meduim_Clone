//src/componets/articleController.ts
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

    // Convert cover bytes → base64
    const formatted = articles.map((a) => ({
      ...a,
      coverImageBase64: a.coverImageBytes
        ? `data:image/png;base64,${Buffer.from(a.coverImageBytes).toString(
            'base64'
          )}`
        : null,
    }));

    res.json(formatted);
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
    res.send(article.coverImageBytes); // Uint8Array works
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

// Update Article
export const updateArticle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { title, content, categoryId, authorId, tags } = req.body;

    const updateData: any = {
      title,
      content,
      categoryId: Number(categoryId),
      authorId: Number(authorId),
    };

    // agar naya image bheja gaya hai
    if (req.file) {
      const fileBuffer: Buffer = req.file.buffer;
      updateData.coverImageBytes = new Uint8Array(fileBuffer);
    }

    if (tags) {
      const parsedTags = JSON.parse(tags);
      updateData.tags = {
        connectOrCreate: parsedTags.map((t: string) => ({
          where: { name: t },
          create: { name: t },
        })),
      };
    }

    const updated = await prisma.article.update({
      where: { id },
      data: updateData,
      include: { tags: true },
    });

    res.json(updated);
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
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to delete article' });
  }
};
