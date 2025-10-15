import { Request, Response } from 'express';
import prisma from '../prisma';

// ============================
//  GET all articles (with filters, search, pagination)
// ============================
export const getArticles = async (req: Request, res: Response) => {
  try {
    const {
      search,
      categoryId,
      authorId,
      page = '1',
      limit = '10',
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { content: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (categoryId) where.categoryId = Number(categoryId);
    if (authorId) where.authorId = Number(authorId);

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          author: { select: { id: true, username: true, email: true } },
          category: { select: { id: true, name: true } },
          tags: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.article.count({ where }),
    ]);

    res.json({
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      articles,
    });
  } catch (err: any) {
    console.error('❌ Error fetching articles:', err);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
};

// ============================
//  GET single article (increment views)
// ============================
export const getArticle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const article = await prisma.article.update({
      where: { id },
      data: { views: { increment: 1 } },
      include: {
        author: { select: { id: true, username: true } },
        category: true,
        comments: {
          include: { user: { select: { id: true, username: true } } },
          orderBy: { createdAt: 'desc' },
        },
        tags: true,
      },
    });

    res.json(article);
  } catch (err: any) {
    console.error('❌ Error fetching article:', err);
    res.status(404).json({ error: 'Article not found' });
  }
};

// ============================
//  CREATE article (with tag linking and validation)
// ============================
export const createArticle = async (req: Request, res: Response) => {
  try {
    const {
      title,
      content,
      coverImage,
      tags = [],
      categoryId,
      authorId,
    } = req.body;

    if (!title || !content || !authorId) {
      return res
        .status(400)
        .json({ error: 'Title, content, and authorId are required' });
    }

    const article = await prisma.article.create({
      data: {
        title,
        content,
        coverImage,
        categoryId: categoryId ? Number(categoryId) : null,
        authorId: Number(authorId),
        tags: {
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
      include: { tags: true, author: true, category: true },
    });

    res.status(201).json(article);
  } catch (err: any) {
    console.error('❌ Error creating article:', err);
    res.status(400).json({ error: err.message });
  }
};

// ============================
//  UPDATE article (partial updates + tag sync)
// ============================
export const updateArticle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { title, content, coverImage, tags, categoryId } = req.body;

    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Article not found' });

    const article = await prisma.article.update({
      where: { id },
      data: {
        title,
        content,
        coverImage,
        categoryId: categoryId ? Number(categoryId) : undefined,
        tags: tags
          ? {
              set: [],
              connectOrCreate: tags.map((tag: string) => ({
                where: { name: tag },
                create: { name: tag },
              })),
            }
          : undefined,
      },
      include: { tags: true },
    });

    res.json(article);
  } catch (err: any) {
    console.error('❌ Error updating article:', err);
    res.status(400).json({ error: err.message });
  }
};

// ============================
//  DELETE article
// ============================
export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Article not found' });

    await prisma.article.delete({ where: { id } });
    res.status(204).send();
  } catch (err: any) {
    console.error('❌ Error deleting article:', err);
    res.status(400).json({ error: err.message });
  }
};
