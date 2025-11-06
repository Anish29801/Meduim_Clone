import { Category } from '@prisma/client';
import prisma from '../prisma';
import { PaginatedResult } from '../types/types';

//get all categories
export const getAllCategories = async (
  page?: number,
  limit?: number
): Promise<PaginatedResult<Category> | Category[]> => {
  if (page && limit) {
    // Pagination
    const skip = (page - 1) * limit;
    const total = await prisma.category.count();
    const data = await prisma.category.findMany({
      skip,
      take: limit,
      orderBy: { id: 'asc' },
      include: { _count: { select: { articles: true } } },
    });
    return { page, limit, total, data };
  } else {
    // All categories
    return await prisma.category.findMany({
      include: { _count: { select: { articles: true } } },
      orderBy: { id: 'asc' },
    });
  }
};

//create category
export const createCategory = async (name: string): Promise<Category> => {
  return await prisma.category.create({
    data: { name },
  });
};

//updatecategory
export const updateCategory = async (
  id: number,
  name: string
): Promise<Category> => {
  return await prisma.category.update({
    where: { id },
    data: { name },
  });
};

//deletecategory
export const deleteCategory = async (id: number): Promise<Category> => {
  const relatedArticles = await prisma.article.findFirst({
    where: { categoryId: id },
  });
  if (relatedArticles) {
    throw new Error('Cannot delete: Category has related articles.');
  }

  return await prisma.category.delete({
    where: { id },
  });
};
export function getCategories(page: number, limit: number) {
  throw new Error('Function not implemented.');
}
