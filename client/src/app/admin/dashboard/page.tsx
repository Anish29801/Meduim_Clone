'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  NewspaperIcon,
  UserGroupIcon,
  TagIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { useApi } from '@/app/hooks/useApi';

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
      <p className="text-center text-gray-500 mt-10">No data available.</p>
    );
  }

  // Cards Data
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

  const barData = [
    { name: 'Articles', value: stats.articles },
    { name: 'Users', value: stats.users },
    { name: 'Categories', value: stats.categories },
  ];

  const lineData = [
    { name: 'Jan', articles: 20, users: 50 },
    { name: 'Feb', articles: 35, users: 70 },
    { name: 'Mar', articles: 50, users: 90 },
    { name: 'Apr', articles: 65, users: 120 },
    { name: 'May', articles: 80, users: 150 },
  ];

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-cyan-50 via-white to-violet-50">
      <h1 className="text-3xl font-bold mb-8 font-serif text-gray-900">
        📊 Admin Dashboard
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
        {cards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className={`relative overflow-hidden rounded-2xl shadow-xl border border-gray-200 bg-gradient-to-br ${card.color}`}
          >
            <div className="absolute inset-0 opacity-80"></div>
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

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-200 shadow-lg p-5"
        >
          <h2 className="text-sm text-gray-700 font-semibold mb-2">
            Vertical Bars
          </h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-gradient-to-br from-pink-100 to-rose-200 shadow-lg p-5"
        >
          <h2 className="text-sm text-gray-700 font-semibold mb-2">
            Trend (Articles vs Users)
          </h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="articles"
                  stroke="#ec4899"
                  strokeWidth={3}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Active vs Inactive Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-200 shadow-lg p-5"
        >
          <h2 className="text-sm text-gray-700 font-semibold mb-2">
            Active vs Inactive
          </h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Active', value: stats.activeUsers || 0 },
                  { name: 'Inactive', value: stats.inactiveUsers || 0 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
