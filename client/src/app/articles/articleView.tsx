'use client';

import React, { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { useRouter } from 'next/navigation';

interface Article {
  id: number;
  title: string;
  content: string;
  coverImageBase64?: string | null;
  author?: { name: string };
  category?: { name: string };
  tags?: { id: number; name: string }[];
}

export default function Articlepage() {
  const { callApi, loading } = useApi<Article[]>();
  const [articles, setArticles] = useState<Article[]>([]);
  const router = useRouter();
  useEffect(() => {
    async function fetcharticles() {
      const data = await callApi('/api/articles');
      setArticles(data);
    }
    fetcharticles();
  }, [callApi]);

  const handleEdit = (id: number) => {
    router.push(`/articles/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      await callApi(`/api/articles/${id}`, { method: 'DELETE' });
      setArticles((prev) => prev.filter((a) => a.id !== id)); // remove from UI
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  if (loading) return <p className="text-center text-lg">Loading...</p>;

  return (
    <div className="max-w-lvh mx-auto p-8">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">All Articles</h1>

      {articles.length === 0 && (
        <p className="text-gray-500 text-center">No articles found.</p>
      )}
      <div className="flex flex-col gap-8">
        {articles.map((a) => (
          <div
            key={a.id}
            className="flex flex-col md:flex-row-reverse bg-white border-2 border-gray-300 shadow-md rounded-xl overflow-hidden hover:shadow-lg hover:border-indigo-400 transition duration-300"
          >
            {/*Image Right Side */}
            {a.coverImageBase64 && (
              <img
                src={a.coverImageBase64}
                alt={a.title}
                className="w-full md:w-1/3 h-48 object-cover"
                loading="lazy"
              />
            )}

            {/* Text Left Side */}
            <div className="p-4 md:w-2/3 space-y-2">
              <h2 className="text-xl font-semibold text-gray-800">{a.title}</h2>

              <p className="text-gray-600 line-clamp-3">
                {a.content.slice(0, 150)}...
              </p>

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

              {/* Author & Category */}
              <div className="text-sm text-gray-500 mt-4">
                {a.author?.name && <span>👤{a.author.name}</span>}
                {a.category?.name && (
                  <span className="ml-4">📂{a.category.name}</span>
                )}
              </div>
              <button
                onClick={() => handleDelete(a.id)}
                className="text-sm text-white bg-red-500 px-3 py-1 rounded-md hover:bg-red-600 transition"
              >
                Delete
              </button>
              <button
                onClick={() => handleEdit(a.id)}
                className="text-sm text-white bg-blue-500 px-3 py-1 rounded-md hover:bg-blue-600 transition"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
