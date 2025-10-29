'use client';
import { useEffect } from 'react';
import { useApi } from '@/app/hooks/useApi';
import {
  ChartBarIcon,
  NewspaperIcon,
  TagIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface Stats {
  articles: number;
  users: number;
  categories: number;
  activeUsers?: number;
  inactiveUsers?: number;
}

export default function AdminDashboard() {
  const { data: stats, loading, error, callApi } = useApi<Stats>();

  useEffect(() => {
    callApi('/api/users/stats');
  }, [callApi]);

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading stats...</p>;
  }

  if (error) {
    return (
      <p className="text-center text-red-500 mt-10">
        Failed to load stats: {error}
      </p>
    );
  }

  if (!stats) {
    return (
      <p className="text-center text-gray-500 mt-10 animate-pulse">
        Loading stats...
      </p>
    );
  }

  const cards = [
    {
      label: 'Articles',
      value: stats.articles,
      color: 'from-blue-500 to-indigo-500',
      icon: <NewspaperIcon className="h-8 w-8 text-white" />,
    },
    {
      label: 'Users',
      value: stats.users,
      color: 'from-emerald-500 to-teal-500',
      icon: <UserGroupIcon className="h-8 w-8 text-white" />,
    },
    {
      label: 'Categories',
      value: stats.categories,
      color: 'from-amber-400 to-orange-500',
      icon: <TagIcon className="h-8 w-8 text-white" />,
    },
    {
      label: 'Active Users',
      value: stats.activeUsers || 0,
      color: 'from-green-500 to-lime-500',
      icon: <ChartBarIcon className="h-8 w-8 text-white" />,
    },
    {
      label: 'Inactive Users',
      value: stats.inactiveUsers || 0,
      color: 'from-rose-500 to-pink-500',
      icon: <ChartBarIcon className="h-8 w-8 text-white" />,
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 font-serif text-gray-900">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="relative overflow-hidden rounded-2xl shadow-xl border border-gray-200 bg-gradient-to-br"
            style={{
              backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
            }}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-90`}
            ></div>

            <div className="relative p-6 text-white flex flex-col justify-between h-40">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">{card.label}</h2>
                <div className="bg-white/20 p-2 rounded-lg">{card.icon}</div>
              </div>

              <p className="text-4xl font-bold mt-4">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
