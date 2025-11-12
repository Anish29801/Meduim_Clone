'use client';

import React, { useEffect, useState } from 'react';
import { useApi } from '@/app/hooks/useApi';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Dompurify from 'dompurify';

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

// Extract plain text from Lexical JSON
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

export default function SingleArticlePage() {
  const { id } = useParams();
  const router = useRouter();
  const { callApi, loading } = useApi<Article>();
  const [article, setArticle] = useState<Article | null>(null);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  //Fetch single article
  useEffect(() => {
    async function fetchArticle() {
      try {
        const data = await callApi(`/api/articles/${id}`);
        if (data.coverImageBytes) {
          const byteArray = Object.values(data.coverImageBytes);
          const uint8Array = new Uint8Array(byteArray as any);
          const blob = new Blob([uint8Array], { type: 'image/png' });
          const base64 = await blobToBase64(blob);
          data.coverImageBase64 = base64;
        }

        setArticle(data);
      } catch (err) {
        console.error('Failed to fetch article:', err);
        toast.error('Failed to fetch article');
      }
    }
    if (id) fetchArticle();
  }, [id, callApi]);

  //Toggle Article Status
  const handleToggleStatus = async () => {
    if (!article) return;
    const newStatus = article.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setUpdating(true);
    try {
      await callApi(`/api/articles/${id}/status`, {
        method: 'PUT',
        data: { status: newStatus },
      });
      setArticle({ ...article, status: newStatus });
      toast.success(`Status changed to ${newStatus}`);
    } catch (err) {
      console.error('Failed to update status:', err);
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };
  const handleEdit = (id: number) => {
    router.push(`/admin/articles/edit/${id}`);
  };
  // Delete Article
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    setDeleting(true);
    try {
      await callApi(`/api/articles/${id}`, { method: 'DELETE' });
      toast.success('Article deleted successfully');
      router.push('/admin/articles'); // redirect back to list
    } catch (err) {
      console.error('Failed to delete article:', err);
      toast.error('Failed to delete article');
    } finally {
      setDeleting(false);
    }
  };
  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  if (loading || !article)
    return <p className="text-center text-lg">Loading...</p>;
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white border-2 border-gray-200 shadow-md rounded-xl overflow-hidden">
        <div className="p-6 space-y-3">
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            {/* 🔹 Title & Status Row */}
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                📝 {article.title}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  article.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {article.status}
              </span>
            </div>

            {/* 🔹 Cover Image Below */}
            {article.coverImageBase64 && (
              <img
                src={article.coverImageBase64}
                alt="Cover Image"
                className="w-full h-30 object-cover rounded-lg"
              />
            )}
          </div>

          <p
            className="text-gray-600 line-clamp-3"
            dangerouslySetInnerHTML={{
              __html: Dompurify.sanitize(
                extractPlainText(article.content).slice(0, 500)
              ),
            }}
          />

          {/*  Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {article.tags.map((t) => (
                <span
                  key={t.id}
                  className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md"
                >
                  #{t.name}
                </span>
              ))}
            </div>
          )}

          {/*Author &Category */}
          <div className="text-sm text-gray-500 mt-4 flex flex-wrap gap-4">
            {article.author?.name && <span>👤 {article.author.name}</span>}
            {article.category?.name && <span>📂 {article.category.name}</span>}
          </div>

          {/*Action Buttons */}
          <div className="flex gap-4 mt-6">
            {/* Edit Button */}
            <button
              onClick={() => handleEdit(article.id)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition"
            >
              ✏️Edit
            </button>

            {/* Toggle Status */}
            <button
              onClick={handleToggleStatus}
              disabled={updating}
              className={`px-4 py-2 rounded-md text-sm text-white transition ${
                article.status === 'ACTIVE'
                  ? 'bg-yellow-500 hover:bg-yellow-600'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {updating
                ? 'Updating...'
                : article.status === 'ACTIVE'
                  ? 'Deactivate'
                  : 'Activate'}
            </button>

            {/* Delete */}
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
