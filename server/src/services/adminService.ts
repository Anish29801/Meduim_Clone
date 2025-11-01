import prisma from '../prisma';

export interface DashboardStats {
  articles: number;
  users: number;
  categories: number;
  activeUsers?: number;
  inactiveUsers?: number;
}

// Fetch dashboard statistics (with optional active/inactive user count)
export const getDashboardStatsService = async (): Promise<DashboardStats> => {
  try {
    const [articles, users, categories, activeUsers, inactiveUsers] =
      await Promise.all([
        prisma.article.count(),
        prisma.user.count(),
        prisma.category.count(),
        prisma.user.count({ where: { status: 'ACTIVE' } }),
        prisma.user.count({ where: { status: 'INACTIVE' } }),
      ]);

    return { articles, users, categories, activeUsers, inactiveUsers };
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    throw new Error('Unable to fetch dashboard statistics');
  }
};
