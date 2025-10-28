'use client';
import React, { useEffect, useState } from 'react';
import { useApi } from '@/app/hooks/useApi';
import toast from 'react-hot-toast';

interface Tag {
  id: number;
  name: string;
}

interface Article {
  id: number;
  title: string;
  content: string;
  coverImageBase64?: string | null;
  categoryId?: number;
  authorId?: number;
  tags?: Tag[];
}

interface Category {
  id: number;
  name: string;
}

interface Props {
  articleId: number;
}

export default function EditArticlePage({ articleId }: Props) {
  const { callApi, loading } = useApi<Article>();
  const [article, setArticle] = useState<Article | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string>('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState<number | ''>('');

  // Load article details
  useEffect(() => {
    async function fetchArticle() {
      try {
        const data = await callApi(`/api/articles/${articleId}`);
        console.log('Fetched article:', data); // Debug check

        if (data) {
          setArticle(data);
          setTitle(data.title || '');
          setContent(data.content || '');
          setCategoryId(data.categoryId ?? '');
          setTags(
            (data.tags && data.tags.map((t: Tag) => t.name).join(', ')) || ''
          );
        }
      } catch (err) {
        console.error('Failed to fetch article', err);
        toast.error('Failed to load article');
      }
    }

    if (articleId) fetchArticle();
  }, [articleId, callApi]);

  // Load all categories
  useEffect(() => {
    async function fetchCategories() {
      const catData = await callApi('/api/categories');
      setCategories(catData);
    }
    fetchCategories();
  }, [callApi]);

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  // Update Article
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('categoryId', String(categoryId || 1));
      formData.append('authorId', String(article?.authorId || 1));
      formData.append(
        'tags',
        JSON.stringify(tags.split(',').map((t) => t.trim()))
      );
      if (coverImage) formData.append('coverImage', coverImage);

      await callApi(`/api/articles/${articleId}`, {
        method: 'PATCH',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Article updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Update failed!');
    }
  };

  if (loading || !article)
    return <p className="text-center mt-10">Loading article...</p>;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-xl space-y-6">
      <h1 className="text-2xl font-bold text-indigo-700">✏️ Edit Article</h1>

      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 border-2 border-gray-300 rounded-xl"
        placeholder="Enter article title"
      />

      {/*Content */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        className="w-full p-3 border-2 border-gray-300 rounded-xl"
        placeholder="Enter article content"
      ></textarea>

      {/*Category Dropdown */}
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(Number(e.target.value))}
        className="w-full p-3 border-2 border-gray-300 rounded-xl"
      >
        <option value="">Select Category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Tags Input */}
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full p-3 border-2 border-gray-300 rounded-xl"
        placeholder="Enter tags (comma separated)"
      />

      {/* Tag Chips Preview */}
      {tags && (
        <div className="flex flex-wrap gap-2">
          {tags.split(',').map((tag, i) => (
            <span
              key={i}
              className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-sm"
            >
              #{tag.trim()}
            </span>
          ))}
        </div>
      )}

      {/*Current Image */}
      {article.coverImageBase64 && (
        <div className="mt-4">
          <p className="text-gray-600 text-sm mb-2">Current Cover:</p>
          <img
            src={article.coverImageBase64}
            alt="Cover"
            className="w-64 h-40 object-cover rounded-xl border"
          />
        </div>
      )}

      {/* Upload New Image */}
      <input type="file" accept="image/*" onChange={handleImageChange} />

      {/* Update Button */}
      <button
        onClick={handleUpdate}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium w-full"
      >
        Update Article
      </button>
    </div>
  );
}
