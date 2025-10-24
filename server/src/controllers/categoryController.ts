import { Request, Response } from 'express';
import prisma from '../prisma';

// GET all categories
export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({});

    console.log('categories', categories);
    res.json(categories);
    // Real DB use karna ho to ye uncomment kar do
    // const categoriesFromDB = await prisma.category.findMany({ include: { articles: true } });
    // res.json(categoriesFromDB);
  } catch {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// CREATE category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const category = await prisma.category.create({ data: { name } });
    res.status(201).json(category);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;
    const category = await prisma.category.update({
      where: { id },
      data: { name },
    });
    res.json(category);
  } catch {
    res.status(400).json({ error: 'Failed to update category' });
  }
};

// DELETE category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.category.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(400).json({ error: 'Failed to delete category' });
  }
};
