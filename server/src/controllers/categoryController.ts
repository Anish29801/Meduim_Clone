import { Request, Response } from 'express';
import * as categoryService from '../services/categoryService';

//get categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const page = parseInt((req.query.page as string) || '1', 10);
    const limit = parseInt((req.query.limit as string) || '10', 10);

    const result = await categoryService.getAllCategories(page, limit);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

//create category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const category = await categoryService.createCategory(name);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

//update category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;
    const category = await categoryService.updateCategory(id, name);
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

//delete category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid category id' });
    }
    await categoryService.deleteCategory(id);
    res.json({ message: 'category deleted succesfully' });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// export const getCategoriesController = async (req: Request, res: Response) => {
//   try {
//     const page = parseInt((req.query.page as string) || 1,;
//     const limit = parseInt(req.query.limit as string) || 5;

//     const result = await categoryService.getPaginationCategory(page, limit);
//     res.json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Something went wrong' });
//   }
// };
