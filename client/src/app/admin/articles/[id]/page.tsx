'use client';

import React, { useEffect, useState } from 'react';
import { useApi } from '@/app/hooks/useApi';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface Article {
  id: number;
  title: string;
  content: string;
  status: 'ACTIVE' | 'INACTIVE';
  coverImageBase64?: string | null;
  author?: { name: string };
  category?: { name: string };
  tags?: { id: number; name: string }[];
}

// 🧩 Extract plain text from Lexical JSON
function extractPlainText(lexicalJSON: string): string {
  try {
    const parsed = JSON.parse(lexicalJSON);
    const root = parsed.root;
    if (!root?.children) return '';

    return root.children
      .map((p: any) =>
        (p.children || []).map((child: any) => child.text || '').join(' ')
      )
      .join('\n')
      .trim();
  } catch {
    return lexicalJSON.slice(0, 200);
  }
}

export default function ArticlePage() {
  const { callApi, loading } = useApi<Article[]>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const router = useRouter();

  // 🔹 Fetch all articles
  useEffect(() => {
    async function fetchArticles() {
      try {
        const data = await callApi('/api/articles');
        setArticles(data);
      } catch (err) {
        console.error('Failed to fetch articles:', err);
      }
    }
    fetchArticles();
  }, [callApi]);

  // 🔹 Toggle Status
  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setUpdatingId(id);
    try {
      await callApi(`/api/articles/${id}/status`, {
        method: 'PUT',
        data: { status: newStatus },
      });
      setArticles((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status: newStatus as 'ACTIVE' | 'INACTIVE' } : a
        )
      );
      toast.success(`Status changed to ${newStatus}`);
    } catch (err) {
      console.error('Failed to update status:', err);
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p className="text-center text-lg">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
          📰 All Articles
        </h1>

        {articles.length === 0 ? (
          <p className="text-gray-500 text-center">No articles found.</p>
        ) : (
          <div className="flex flex-col gap-8">
            {articles.map((a) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col md:flex-row-reverse bg-white border-2 border-gray-200 shadow-md rounded-xl overflow-hidden hover:shadow-lg hover:border-indigo-400 transition duration-300"
              >
                {/* 🖼️ Cover Image */}
                {a.coverImageBase64 && (
                  <img
                    src={a.coverImageBase64}
                    alt={a.title}
                    className="w-full md:w-1/3 h-48 object-cover"
                    loading="lazy"
                  />
                )}

                {/* 📝 Article Info */}
                <div className="p-5 md:w-2/3 space-y-3">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {a.title}
                  </h2>

                  <p className="text-gray-600 line-clamp-3">
                    {extractPlainText(a.content).slice(0, 200)}...
                  </p>

                  {/* 🏷️ Tags */}
                  {a.tags && a.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {a.tags.map((t) => (
                        <span
                          key={t.id}
                          className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md"
                        >
                          #{t.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 👤 Author & 📂 Category */}
                  <div className="text-sm text-gray-500 mt-3 flex flex-wrap gap-4">
                    {a.author?.name && <span>👤 {a.author.name}</span>}
                    {a.category?.name && <span>📂 {a.category.name}</span>}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        a.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>

                  {/*Actions */}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleToggleStatus(a.id, a.status)}
                      disabled={updatingId === a.id}
                      className={`text-sm px-3 py-1 rounded-md text-white ${
                        a.status === 'ACTIVE'
                          ? 'bg-yellow-500 hover:bg-yellow-600'
                          : 'bg-green-500 hover:bg-green-600'
                      } transition`}
                    >
                      {updatingId === a.id
                        ? 'Updating...'
                        : a.status === 'ACTIVE'
                          ? 'Deactivate'
                          : 'Activate'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
