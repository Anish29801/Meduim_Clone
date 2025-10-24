'use client';

import { useState, useEffect } from 'react';
import LexicalEditor from '@/app/components/lecxicaleditor';
import { useApi } from '@/app/hooks/useApi';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function ArticleForm() {
  const router = useRouter();
  const { callApi } = useApi();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [isSaving, setIsSaving] = useState(false);

  // Fetch categories
  useEffect(() => {
    callApi('/api/categories')
      .then((data) => setCategories(data || []))
      .catch(() => toast.error('Failed to fetch categories'));
  }, [callApi]);

  const addTag = (tag: string) => {
    const t = tag.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const handleSave = async () => {
    if (!title.trim()) return toast.error('Title is required!');
    setIsSaving(true);
    try {
      const payload = {
        title: title.trim(),
        content,
        coverImage: coverImage.trim(),
        categoryId,
        tags,
        authorId: 1,
      };

      await callApi('/api/articles', {
        method: 'POST',
        data: payload,
      });

      toast.success('✅ Article created successfully!');
      setTimeout(() => router.push('/dashboard'), 10);
    } catch {
      toast.error('Failed to create article');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-6">
      <Toaster position="top-right" />
      <h1 className="text-4xl font-extrabold text-gray-900">
        📝 Create New Article
      </h1>

      {/* Title */}
      <input
        type="text"
        placeholder="Title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg font-medium transition"
      />

      {/* Cover Image */}
      <input
        type="text"
        placeholder="Cover image URL..."
        value={coverImage}
        onChange={(e) => setCoverImage(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
      />
      {coverImage && (
        <img
          src={coverImage}
          alt="cover"
          className="w-full max-h-64 rounded-xl shadow-lg object-cover mt-2 transition-all duration-300 hover:scale-105"
          onError={(e) =>
            ((e.target as HTMLImageElement).style.display = 'none')
          }
        />
      )}

      {/* Category */}
      <select
        value={categoryId ?? ''}
        onChange={(e) =>
          setCategoryId(e.target.value ? Number(e.target.value) : null)
        }
        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
      >
        <option value="">Select category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Tags */}
      <input
        type="text"
        placeholder="Add tag and press Enter"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            addTag((e.target as HTMLInputElement).value);
            (e.target as HTMLInputElement).value = '';
          }
        }}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
      />
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((t) => (
          <span
            key={t}
            className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full flex items-center gap-2 text-sm font-medium shadow-sm transition hover:bg-indigo-200"
          >
            {t}
            <button
              onClick={() => removeTag(t)}
              className="text-red-500 hover:text-red-700 transition"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Lexical Editor */}
      <div className="border border-gray-300 rounded-xl p-4 bg-white shadow-sm">
        <LexicalEditor initialContent={content} onChange={setContent} />
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-500">
          {isSaving ? 'Saving...' : 'Click Save to create'}
        </span>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Creating…' : '📝 Create Article'}
        </button>
      </div>
    </main>
  );
}
