
  // const category = await prisma.category.findUnique({
  //   where: { id: Number(categoryId) },
  // });
  // console.log('category', category);
  // if (!category) throw new Error('Invalid categoryId');


  backend==>

1.components/articleController.ts
import { Request, Response } from 'express';
import prisma from '../prisma';
import { CreateArticleData } from '../services/articleService';

// CREATE article
export const createArticle = async (
  req: Request<{}, {}, CreateArticleData>,
  res: Response
) => {
  try {
    const { title, content, coverImageBase64, tags, categoryId, authorId } =
      req.body;
    if (!coverImageBase64) throw new Error('Cover image required');

    // Base64 → Buffer
    const matches = coverImageBase64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3)
      throw new Error('Invalid base64 image');

    const buffer = Buffer.from(matches[2], 'base64'); // store binary

    const article = await prisma.article.create({
      data: {
        title,
        content,
        coverImageBytes: buffer,
        categoryId,
        authorId,
        tags: {
          connectOrCreate: (tags || []).map((tag) => ({
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

// GET single article (with metadata)
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

    res.json(article); // coverImageBytes included
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
    res.send(Buffer.from(article.coverImageBytes.buffer));
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

2.services/articleServices.ts
import prisma from '../prisma';

// ✅ Type definition for Create Article
export interface CreateArticleData {
  title: string;
  content: string;
  coverImageBase64: string;
  tags: string[];
  categoryId: number;
  authorId: number;
}

// Create Article Service
export const createArticleService = async (data: CreateArticleData) => {
  const { title, content, coverImageBase64, tags, categoryId, authorId } = data;

  if (!title) throw new Error('Title required');
  if (!categoryId) throw new Error('Category required');
  if (!coverImageBase64) throw new Error('Cover image required');

  // Base64 → Buffer
  const matches = coverImageBase64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) throw new Error('Invalid base64 image');

  const buffer = Buffer.from(matches[2], 'base64');

  const article = await prisma.article.create({
    data: {
      title,
      content,
      coverImageBytes: buffer,
      categoryId,
      authorId,
      tags: {
        connectOrCreate: (tags || []).map((tagName) => ({
          where: { name: tagName },
          create: { name: tagName },
        })),
      },
    },
    include: { tags: true },
  });

  return article;
};

3.router/articleRouter.ts