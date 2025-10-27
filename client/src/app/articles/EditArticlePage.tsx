'use client';
import React, { useEffect, useState } from 'react';
import { useApi } from '@/app/hooks/useApi';
import toast from 'react-hot-toast';

interface Article {
  id: number;
  title: string;
  content: string;
  coverImageBase64?: string | null;
  categoryId?: number;
  authorId?: number;
  tags?: { id: number; name: string }[];
}

interface Props {
  articleId: number;
}

export default function EditArticlePage({ articleId }: Props) {
  const { callApi, loading } = useApi<Article>();
  const [article, setArticle] = useState<Article | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string>('');
  const [coverImage, setCoverImage] = useState<File | null>(null);

  // 🔹 Step 1: Load existing article
  useEffect(() => {
    async function fetchArticle() {
      const data = await callApi(`/api/articles/${articleId}`);
      setArticle(data);
      setTitle(data.title);
      setContent(data.content);
      setTags(data.tags?.map((t: { name: any }) => t.name).join(', ') || '');
    }
    fetchArticle();
  }, [articleId, callApi]);

  // 🔹 Step 2: Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  // 🔹 Step 3: Handle Update (PATCH)
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append(
        'tags',
        JSON.stringify(tags.split(',').map((t) => t.trim()))
      );
      formData.append('categoryId', String(article?.categoryId || 1));
      formData.append('authorId', String(article?.authorId || 1));
      if (coverImage) formData.append('coverImage', coverImage);

      await callApi(`/api/articles/${articleId}`, {
        method: 'PATCH',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('✅ Article updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('❌ Update failed');
    }
  };

  if (loading || !article) return <p>Loading article...</p>;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-lg space-y-6">
      <h1 className="text-2xl font-bold text-indigo-700">
        ✏️ Edit Article - {article.title}
      </h1>

      {/* 🔹 Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-xl"
        placeholder="Enter article title"
      />

      {/* 🔹 Content */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        className="w-full p-3 border border-gray-300 rounded-xl"
        placeholder="Enter article content"
      ></textarea>

      {/* 🔹 Tags */}
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-xl"
        placeholder="Enter tags (comma separated)"
      />

      {/* 🔹 Current Image Preview */}
      {article.coverImageBase64 && (
        <img
          src={article.coverImageBase64}
          alt="Current cover"
          className="w-64 h-40 object-cover rounded-xl border"
        />
      )}

      {/* 🔹 Upload New Image */}
      <input type="file" accept="image/*" onChange={handleImageChange} />

      {/* 🔹 Update Button */}
      <button
        onClick={handleUpdate}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium"
      >
        Update Article
      </button>
    </div>
  );
}
