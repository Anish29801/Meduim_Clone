import { Request, Response } from 'express';
import prisma from '../prisma';

// GET all tags
export const getTags = async (_req: Request, res: Response) => {
  try {
    const tags = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: { articles: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.status(200).json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
};
