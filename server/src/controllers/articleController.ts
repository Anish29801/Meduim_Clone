import { Request, Response } from 'express';
import prisma from '../prisma';
import fs from 'fs';
import path from 'path';

// Get all articles
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

// Get single article
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

// CREATE article (with base64 cover image)
export const createArticle = async (req: Request, res: Response) => {
  try {
    const { title, content, coverImageBase64, tags, categoryId, authorId } =
      req.body;

    if (!title) throw new Error('Title is required');
    if (!categoryId) throw new Error('Category is required');
    if (!coverImageBase64) throw new Error('Cover image required');

    // Base64 → file
    const matches = coverImageBase64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3)
      throw new Error('Invalid base64 image');

    const buffer = Buffer.from(matches[2], 'base64');
    const uploadDir = path.join(__dirname, '../../public/uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const filename = `cover-${Date.now()}.png`;
    fs.writeFileSync(path.join(uploadDir, filename), buffer);

    const coverImageUrl = `/uploads/${filename}`;

    const article = await prisma.article.create({
      data: {
        title,
        content,
        coverImage: coverImageUrl,
        categoryId: Number(categoryId),
        authorId: Number(authorId),
        tags: {
          connectOrCreate: (tags || []).map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
      include: { tags: true },
    });

    res.status(201).json(article);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};
// Update article
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
              set: [],
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

// Delete article
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
