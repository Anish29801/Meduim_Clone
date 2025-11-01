//src/Services/articleService.ts
import prisma from '../prisma';

// ✅ Type for creating a new article
export interface CreateArticleData {
  title: string;
  content: string;
  categoryId: number;
  authorId: number;
  tags: string[];
  coverImageBytes: Uint8Array<ArrayBuffer>; // actual file bytes
}

// ✅ Create new article
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
    include: {
      tags: true,
      author: { select: { id: true, username: true } }, // ✅ include author
      category: { select: { id: true, name: true } }, // ✅ include category
    },
  });

  return article;
};

// ✅ Fetch all articles (used in Admin panel)
export const getAllArticlesService = async () => {
  const articles = await prisma.article.findMany({
    include: {
      author: { select: { id: true, username: true } },
      category: { select: { id: true, name: true } },
      tags: true,
    },
    orderBy: { createdAt: 'desc' }, // optional, newest first
  });

  return articles;
};

// ✅ Toggle article status (ACTIVE / INACTIVE)
export const updateArticleStatusService = async (
  id: number,
  status: string
) => {
  const updated = await prisma.article.update({
    where: { id },
    data: { status },
  });

  return updated;
};

// ✅ Get a single article by ID
export const getArticleByIdService = async (id: number) => {
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, username: true } },
      category: { select: { id: true, name: true } },
      tags: true,
    },
  });

  if (!article) throw new Error('Article not found');
  return article;
};
