'use client';

import { useState, useEffect } from 'react';
import LexicalEditor from '@/app/components/lecxicaleditor';
import { useApi } from '@/app/hooks/useApi';
import toast, { Toaster } from 'react-hot-toast';

interface ArticlePageProps {
  articleId?: number;
}

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await callApi('/api/categories');
        setCategories(data || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, [callApi]);

  useEffect(() => {
    if (!id) return;
    const fetchArticle = async () => {
      try {
        const data = await callApi(`/api/articles/${id}`);
        setTitle(data.title || '');
        setContent(data.content || '');
        setCoverImage(data.coverImage || '');
        setCategoryId(data.categoryId ?? null);
        setTags(data.tags?.map((t: any) => t.name) || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch article');
      }
    };
    fetchArticle();
  }, [id, callApi]);

  const handleAddTag = (tag: string) => {
    const t = tag.trim();
    if (!t) return;
    if (!tags.includes(t)) setTags((s) => [...s, t]);
  };

  const handleRemoveTag = (tag: string) => {
    setTags((s) => s.filter((t) => t !== tag));
  };

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
    } catch (err) {
      console.error(err);
      toast.error('Failed to save article');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-6">
      <Toaster position="top-right" /> {/*Add Toaster container */}
      <header className="mb-2">
        <h1 className="text-4xl font-bold text-gray-900">
          {id ? '✏️ Edit Article' : '📝 Create Article'}
        </h1>
        <p className="text-gray-500 mt-1">
          {id
            ? 'Update your article and click Save.'
            : 'Write a new story and save it.'}
        </p>
      </header>
      {/* Title */}
      <input
        type="text"
        placeholder="Article title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none text-lg font-medium"
      />
      {/* Cover Image */}
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Cover image URL (optional)"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
        />
        {coverImage && (
          <img
            src={coverImage}
            alt="cover"
            className="w-full rounded-xl shadow object-cover max-h-[320px]"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
      </div>
      {/* Category */}
      <select
        value={categoryId ?? ''}
        onChange={(e) =>
          setCategoryId(e.target.value ? Number(e.target.value) : null)
        }
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
      >
        <option value="">Select category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      {/* Tags */}
      <div>
        <input
          type="text"
          placeholder="Add tag and press Enter"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddTag((e.target as HTMLInputElement).value);
              (e.target as HTMLInputElement).value = '';
            }
          }}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
        />
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((t) => (
            <span
              key={t}
              className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2 text-sm border"
            >
              <span>#{t}</span>
              <button
                onClick={() => handleRemoveTag(t)}
                className="text-red-500 hover:text-red-700"
                aria-label={`remove ${t}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
      {/* Editor */}
      <div className="rounded-xl border border-gray-200 shadow-sm p-2 bg-white">
        <LexicalEditor initialContent={content} onChange={setContent} />
      </div>
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {isSaving ? 'Saving...' : 'Autosave off • Click Save to persist'}
        </div>

        <div>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-gray-900 text-white rounded-full font-semibold hover:scale-105 transition-transform duration-150 shadow"
            disabled={isSaving}
          >
            {isSaving ? 'Saving…' : '💾 Save Article'}
          </button>
        </div>
      </div>
    </main>
  );
}
