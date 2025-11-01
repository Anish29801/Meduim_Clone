'use client';

import { useEffect } from 'react';
import { useApi } from '@/app/hooks/useApi';
import { motion } from 'framer-motion';

interface Author {
  id: number;
  username: string;
}

interface Category {
  id: number;
  name: string;
}

interface Article {
  id: number;
  title: string;
  status: string;
  author?: Author;
  category?: Category;
}

export default function AdminArticlesPage() {
  const { data, loading, error, callApi } = useApi<Article[]>();

  useEffect(() => {
    callApi('/api/articles');
  }, []);

  const handleToggleStatus = async (article: Article) => {
    const newStatus = article.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await callApi(`/api/articles/${article.id}/status`, {
        method: 'PUT',
        data: { status: newStatus },
      });

      // Refresh the article list after update
      await callApi('/api/articles');
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  // Loading state
  if (loading)
    return (
      <p className="text-center text-gray-500 mt-10">Loading articles...</p>
    );

  // Error state
  if (error)
    return (
      <p className="text-center text-red-500 mt-10">
        Failed to load articles: {error}
      </p>
    );

  // Empty list state
  if (!data || data.length === 0)
    return (
      <p className="text-center text-gray-500 mt-10">No articles found.</p>
    );

  // Table view
  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <h1 className="text-3xl font-bold mb-6 font-serif text-gray-900">
        📝 Manage Articles
      </h1>

      <div className="overflow-x-auto shadow-lg rounded-2xl bg-white border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Title
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Author
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Category
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Status
              </th>
              <th className="px-6 py-3 text-right font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((article: Article, index: number) => (
              <motion.tr
                key={article.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 transition-all"
              >
                {/* Title */}
                <td className="px-6 py-4">{article.title}</td>

                {/* Author username */}
                <td className="px-6 py-4">
                  {article.author?.username || 'N/A'}
                </td>

                {/* Category */}
                <td className="px-6 py-4">{article.category?.name || 'N/A'}</td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      article.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {article.status}
                  </span>
                </td>

                {/* Action button */}
                <td className="px-6 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(article)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      article.status === 'ACTIVE'
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {article.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
