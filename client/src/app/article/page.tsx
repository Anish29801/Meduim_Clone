'use client';

import { useState, useEffect } from 'react';
import LexicalEditor from '@/app/components/lecxicaleditor';
import { useApi } from '@/app/hooks/useApi';
import toast, { Toaster } from 'react-hot-toast';
import type { ArticlePageProps } from '../type';

export default function ArticlePage({ articleId }: ArticlePageProps) {
  const [id, setId] = useState<number | null>(articleId || null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [isSaving, setIsSaving] = useState(false);

  const { callApi } = useApi();

  // Fetch categories
  useEffect(() => {
    callApi('/api/categories')
      .then((data) => setCategories(data || []))
      .catch(() => toast.error('Failed to fetch categories'));
  }, [callApi]);

  // Fetch article if editing
  useEffect(() => {
    if (!id) return;
    callApi(`/api/articles/${id}`)
      .then((data) => {
        setTitle(data.title || '');
        setContent(data.content || '');
        setCoverImage(data.coverImage || '');
        setCategoryId(data.categoryId ?? null);
        setTags(data.tags?.map((t: any) => t.name) || []);
      })
      .catch(() => toast.error('Failed to fetch article'));
  }, [id, callApi]);

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
      const data = await callApi(`/api/articles${id ? '/' + id : ''}`, {
        method: id ? 'PUT' : 'POST',
        data: payload,
      });
      toast.success('Article saved successfully!');
      if (!id && data?.id) setId(data.id);
    } catch {
      toast.error('Failed to save article');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-4">
      <Toaster position="top-right" />

      <h1 className="text-3xl font-bold">
        {id ? '✏️ Edit Article' : '📝 Create Article'}
      </h1>

      <input
        type="text"
        placeholder="Title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-gray-900"
      />

      <input
        type="text"
        placeholder="Cover image URL..."
        value={coverImage}
        onChange={(e) => setCoverImage(e.target.value)}
        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-gray-900"
      />
      {coverImage && (
        <img
          src={coverImage}
          alt="cover"
          className="w-full max-h-64 rounded shadow object-cover"
          onError={(e) =>
            ((e.target as HTMLImageElement).style.display = 'none')
          }
        />
      )}

      <select
        value={categoryId ?? ''}
        onChange={(e) =>
          setCategoryId(e.target.value ? Number(e.target.value) : null)
        }
        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-gray-900"
      >
        <option value="">Select category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

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
        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-gray-900"
      />
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((t) => (
          <span
            key={t}
            className="bg-gray-200 px-2 py-1 rounded-full flex items-center gap-1 text-sm"
          >
            {t}
            <button onClick={() => removeTag(t)} className="text-red-500">
              ×
            </button>
          </span>
        ))}
      </div>

      <div className="border rounded p-2 bg-white">
        <LexicalEditor initialContent={content} onChange={setContent} />
      </div>

      <div className="flex justify-between items-center mt-2">
        <span className="text-sm text-gray-500">
          {isSaving ? 'Saving...' : 'Click Save to persist'}
        </span>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-gray-900 text-white rounded hover:scale-105 transition"
          disabled={isSaving}
        >
          {isSaving ? 'Saving…' : '💾 Save'}
        </button>
      </div>
    </main>
  );
}
