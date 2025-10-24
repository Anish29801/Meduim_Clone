import prisma from '../prisma';

interface CreateArticleData {
  title: string;
  content: string;
  coverImage: string; // URL string
  tags: string[];
  categoryId: number;
  authorId: number;
}

export const createArticleService = async (data: CreateArticleData) => {
  const { title, content, coverImage, tags, categoryId, authorId } = data;

  if (!categoryId) throw new Error('categoryId is required');

  const category = await prisma.category.findUnique({
    where: { id: Number(categoryId) },
  });
  console.log('category', category);
  // if (!category) throw new Error('Invalid categoryId');

  const article = await prisma.article.create({
    data: {
      title,
      content,
      coverImage,
      categoryId: category?.id || 1,
      authorId,
      tags: {
        connectOrCreate: tags.map((tagName) => ({
          where: { name: tagName },
          create: { name: tagName },
        })),
      },
    },
    include: { tags: true },
  });

  return article;
};
