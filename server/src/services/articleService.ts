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
