'use client';

import { useApi } from '@/app/hooks/useApi';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import LexicalEditor from '../components/lecxicaleditor';

// 🧩 Interfaces
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
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const router = useRouter();

  // 🔹 Load article details
  useEffect(() => {
    async function fetchArticle() {
      try {
        const data = await callApi(`/api/articles/${articleId}`);
        let coverImageBase64 = null;
        if (data.coverImageBytes) {
          const byteArray = Object.values(data.coverImageBytes) as number[];
          coverImageBase64 = `data:image/png;base64,${bytesToBase64(byteArray)}`;
        }
        if (data) {
          setArticle({ ...data, coverImageBase64 });
          setTitle(data.title || '');
          setContent(data.content || '');
          setCategoryId(data.categoryId ?? '');
          setTags(data.tags ? data.tags.map((t: Tag) => t.name) : []);
          toast.success('Article loaded successfully!');
        }
      } catch (err) {
        console.error('Failed to fetch article', err);
        toast.error('Failed to load article ❌');
      }
    }

    if (articleId) fetchArticle();
  }, [articleId]);

  // 🔹 Load categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await callApi('/api/categories');
        const categoryArray: Category[] = Array.isArray(res)
          ? res
          : Array.isArray(res.data)
            ? res.data
            : [];

        setCategories(categoryArray);
      } catch {
        toast.error('Failed to load categories ❌');
      }
    }
    fetchCategories();
  }, [callApi]);

  // 🔹 Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  // 🔹 Update article
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('categoryId', String(categoryId || 1));
      formData.append('authorId', String(article?.authorId || 1));
      formData.append('tags', JSON.stringify(tags));
      if (coverImage) formData.append('coverImage', coverImage);

      await callApi(`/api/articles/${articleId}`, {
        method: 'PATCH',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Article updated successfully 🎉', {
        duration: 3000,
        position: 'top-right',
      });
      setTimeout(() => router.push('/articles/view'), 400);
    } catch (err) {
      console.error(err);
      toast.error('Update failed ❌');
    }
  };

  // Tags
  const handleAddTag = () => {
    if (!newTag.trim()) return;

    const newTags = newTag
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t && !tags.includes(t));

    setTags([...tags, ...newTags]);
    setNewTag('');
  };

  const handleRemoveTag = (tag: string) =>
    setTags(tags.filter((t) => t !== tag));

  //image convert chunks
  function bytesToBase64(bytes: number[]) {
    let binary = '';
    const chunkSize = 0x8000; // 32KB chunks
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.slice(i, i + chunkSize);
      binary += String.fromCharCode(...chunk);
    }
    return btoa(binary);
  }

  //back button
  const goBack = () => {
    router.back();
  };

  //tags are arrays
  if (loading || !article)
    return <p className="text-center mt-10">Loading article...</p>;

  // 🔹 JSX
  return (
    <div className="flex flex-col h-screen bg-[#fafafa] overflow-y-auto">
      {/* ===== Header ===== */}
      <button
        onClick={goBack}
        className="w-24 px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
      >
        ← Back
      </button>

      <header className="sticky top-0 z-20 px-10 py-4 flex items-center justify-between bg-[#fafafa]">
        <h1 className="text-2xl font-bold text-indigo-700">✏️ Edit Article</h1>
        <button
          onClick={handleUpdate}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full transition-all"
        >
          Update
        </button>
      </header>

      <main className="flex flex-1 px-10 py-6 overflow-hidden">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 flex-1 overflow-y-auto">
          {/* ===== LEFT PANEL (Meta Info) ===== */}
          <aside className="lg:col-span-1 space-y-6 sticky top-24 self-start bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            {/* Title */}
            <label className="block mb-2 text-gray-900 font-medium">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter article title"
              className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-400 focus:outline-none transition"
            />

            {/* Category */}
            <div>
              <label className="block mb-2 text-gray-900 font-medium">
                Category
              </label>
              <select
                value={categoryId ?? ''}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gray-400 focus:outline-none transition"
              >
                <option value="">Select Category</option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block mb-2 text-gray-900 font-medium">
                Tags
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-400 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-5 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition text-sm"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-3 mt-2">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-300 transition"
                  >
                    <span className="font-medium">#{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="text-gray-500 hover:text-red-500 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-gray-600 text-sm mb-2">Cover Image</p>

              {/* Preview Area */}
              <div className="relative w-full h-40 border rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                {/* Show selected new file */}
                {coverImage ? (
                  <div className="relative w-full h-full">
                    <img
                      src={URL.createObjectURL(coverImage)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setCoverImage(null)}
                      className="absolute top-2 right-2 bg-gray-800 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-500 transition"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  // Show previous cover image
                  article?.coverImageBase64 && (
                    <img
                      src={article.coverImageBase64}
                      alt="Current Cover"
                      className="w-full h-full object-cover"
                    />
                  )
                )}
              </div>

              {/* File Input */}
              <label
                htmlFor="coverImage"
                className="mt-3 block w-full text-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition"
              >
                {coverImage ? 'Change File' : 'Choose a file'}
              </label>
              <input
                id="coverImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </aside>

          {/* ===== RIGHT PANEL (Content Editor) ===== */}
          <section className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 flex flex-col flex-1 border border-gray-200">
            <label className="block mb-3 text-gray-800 font-semibold text-lg">
              Write your story
            </label>
            <div className="flex-1 bg-white p-4 overflow-y-auto rounded-md border border-gray-100">
              <LexicalEditor initialContent={content} onChange={setContent} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
