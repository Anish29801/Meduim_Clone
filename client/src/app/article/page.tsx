'use client';

import { useState, useEffect } from 'react';
import LexicalEditor from '@/app/components/lecxicaleditor';
import { useApi } from '@/app/hooks/useApi';

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

  const { callApi } = useApi();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await callApi('/api/categories');
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, [callApi]);

  // Fetch article if editing
  useEffect(() => {
    if (!id) return;
    const fetchArticle = async () => {
      try {
        const data = await callApi(`/api/articles/${id}`);
        setTitle(data.title);
        setContent(data.content);
        setCoverImage(data.coverImage || '');
        setCategoryId(data.categoryId || null);
        setTags(data.tags?.map((t: any) => t.name) || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchArticle();
  }, [id, callApi]);

  // Tags handlers
  const handleAddTag = (tag: string) =>
    tag && !tags.includes(tag) && setTags([...tags, tag]);
  const handleRemoveTag = (tag: string) =>
    setTags(tags.filter((t) => t !== tag));

  // Save article
  const handleSave = async () => {
    if (!title) return alert('Title is required!');
    try {
      const payload = {
        title,
        content,
        coverImage,
        categoryId,
        tags,
        authorId: 1,
      };
      const data = await callApi(`/api/articles${id ? '/' + id : ''}`, {
        method: id ? 'PUT' : 'POST',
        data: payload,
      });
      alert('Article saved!');
      if (!id) setId(data.id);
    } catch (err) {
      console.error(err);
      alert('Failed to save article');
    }
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        {id ? 'Edit Article' : 'Create Article'}
      </h1>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-4 px-3 py-2 border rounded"
      />

      <input
        type="text"
        placeholder="Cover Image URL"
        value={coverImage}
        onChange={(e) => setCoverImage(e.target.value)}
        className="w-full mb-4 px-3 py-2 border rounded"
      />

      <select
        value={categoryId || ''}
        onChange={(e) => setCategoryId(Number(e.target.value))}
        className="w-full mb-4 px-3 py-2 border rounded"
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Add tag and press Enter"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddTag((e.target as HTMLInputElement).value.trim());
              (e.target as HTMLInputElement).value = '';
            }
          }}
          className="w-full px-3 py-2 border rounded"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-200 px-2 py-1 rounded-full flex items-center gap-1"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="text-red-500"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <LexicalEditor initialContent={content} onChange={setContent} />

      <button
        onClick={handleSave}
        className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800"
      >
        Save Article
      </button>
    </main>
  );
}
