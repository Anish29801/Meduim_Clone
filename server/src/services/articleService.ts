//src/Services/articleService.ts
import prisma from '../prisma';

export interface CreateArticleData {
  title: string;
  content: string;
  categoryId: number;
  authorId: number;
  tags: string[];
  coverImageBytes: Uint8Array<ArrayBuffer>; // ✅ actual file bytes
}

export const createArticleService = async (data: CreateArticleData) => {
  const { title, content, categoryId, authorId, tags, coverImageBytes } = data;

  if (!title) throw new Error('Title is required');
  if (!categoryId) throw new Error('Category is required');
  if (!coverImageBytes) throw new Error('Cover image required');

  const article = await prisma.article.create({
    data: {
      title,
      content,
      categoryId,
      authorId,
      coverImageBytes,
      tags: {
        connectOrCreate: (tags || []).map((tag) => ({
          where: { name: tag },
          create: { name: tag },
        })),
      },
    },
    include: { tags: true },
  });

  return article;
};
