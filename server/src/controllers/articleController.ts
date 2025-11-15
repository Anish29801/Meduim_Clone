//src/componets/articleController.ts
import { Request, Response } from 'express';
import prisma from '../prisma';
import {
  createArticleService,
  getArticleStatusService,
  updateArticleService,
  updateArticleStatusService,
} from '../services/articleService';

// multer middleware ke sath
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

// ✅ Get articles by specific author
export const getArticlesByAuthor = async (req: Request, res: Response) => {
  try {
    const authorId = Number(req.params.authorId);
    if (isNaN(authorId)) {
      return res.status(400).json({ error: 'Invalid author ID' });
    }

    const articles = await prisma.article.findMany({
      where: { authorId },
      include: {
        category: true,
        tags: { select: { id: true, name: true } },
      },
    });

    const formatted = articles.map((a) => ({
      ...a,
      coverImageBase64: a.coverImageBytes
        ? `data:image/png;base64,${Buffer.from(a.coverImageBytes).toString('base64')}`
        : null,
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch author articles' });
  }
};

// GET all articles
export const getArticles = async (req: Request, res: Response) => {
  try {
    const search = req.query.title?.toString().toLowerCase() || '';
    const articles = await prisma.article.findMany({
      include: {
        author: true,
        category: true,
        tags: { select: { id: true, name: true } },
      },
    });

    //JS search filter(case-insensitive)
    const filtered = search
      ? articles.filter(
          (a) =>
            a.title.toLowerCase().includes(search) ||
            a.content.toLowerCase().includes(search) ||
            a.tags.some((t) => t.name.toLowerCase().includes(search))
        )
      : articles;

    // Image bytes Base64 convert
    const formatted = filtered.map((a) => ({
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

// TOGGLE ARTICLE STATUS (ACTIVE/INACTIVE)

export const toggleArticleStatus = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body; // expected: "ACTIVE" or "INACTIVE"

    if (!['ACTIVE', 'INACTIVE'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const updatedArticle = await prisma.article.update({
      where: { id },
      data: { status },
    });

    res.json({
      message: `Article status updated to ${status}`,
      article: updatedArticle,
    });
  } catch (err) {
    console.error('Failed to update article status:', err);
    res.status(500).json({ error: 'Failed to update article status' });
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
export const updateArticleController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { title, content, categoryId, authorId, tags } = req.body;

    // Handle optional file upload
    const coverImageBytes: Uint8Array | undefined = req.file
      ? new Uint8Array(req.file.buffer)
      : undefined;

    const updatedArticle = await updateArticleService(id, {
      title,
      content,
      categoryId: categoryId ? Number(categoryId) : undefined,
      authorId: authorId ? Number(authorId) : undefined,
      tags: tags ? JSON.parse(tags) : undefined, // optional
      coverImageBytes, // optional
    });

    res.json(updatedArticle);
  } catch (err: any) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Failed to update article' });
  }
};

// DELETE article
export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const articleId = Number(req.params.id);

    await prisma.$transaction(async (prisma) => {
      await prisma.tag.deleteMany({
        where: {
          articles: {
            some: { id: articleId },
          },
          AND: {
            articles: {
              none: { id: { not: articleId } },
            },
          },
        },
      });

      // Delete the article itself
      await prisma.article.delete({
        where: { id: articleId },
      });
    });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to delete article' });
  }
};

export const getArticleStatus = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const article = await getArticleStatusService(id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/articles/category/:categoryId
export const getArticlesByCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = parseInt(req.params.categoryId);
    const articles = await prisma.article.findMany({
      where: { categoryId },
      include: {
        author: true,
        category: true,
        tags: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

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
    res.status(500).json({ error: 'Failed to fetch articles by category' });
  }
};

// GET /api/articles/tag/:tagId
export const getArticlesByTag = async (req: Request, res: Response) => {
  try {
    const tagId = parseInt(req.params.tagId);

    const articles = await prisma.article.findMany({
      where: { tags: { some: { id: tagId } } },
      include: {
        author: true,
        category: true,
        tags: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

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
    res.status(500).json({ error: 'Failed to fetch articles by tag' });
  }
};
