'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { useApi } from '@/app/hooks/useApi';
import LexicalEditor from '../components/lecxicaleditor';

interface Category {
  id: number;
  name: string;
}

export default function ArticleForm() {
  const router = useRouter();
  const { callApi } = useApi();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState<any>(null); // ✅ added

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ✅ Safe localStorage access
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      if (user) setUserData(JSON.parse(user));
    }
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await callApi('/api/categories');
        setCategories(data);
      } catch {
        toast.error('Failed to fetch categories');
      }
    }
    fetchCategories();
  }, [callApi]);

  // File selection handlers
  const handleFileChange = (file: File) => setCoverFile(file);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0])
      handleFileChange(e.target.files[0]);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0])
      handleFileChange(e.dataTransfer.files[0]);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();
  const removeCoverImage = () => setCoverFile(null);

  // Tags
  const handleAddTag = () => {
    const tag = newTag.trim();
    if (tag && !tags.includes(tag)) setTags([...tags, tag]);
    setNewTag('');
  };
  const handleRemoveTag = (tag: string) =>
    setTags(tags.filter((t) => t !== tag));

  // Save article
  const handleSave = async () => {
    if (!title.trim()) return toast.error('Title is required!');
    if (!categoryId) return toast.error('Please select a category!');
    if (!coverFile) return toast.error('Please select a cover image!');
    if (!userData?.id) return toast.error('User not logged in!');

    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('content', content);
      formData.append('categoryId', categoryId.toString());
      formData.append('authorId', userData.id.toString()); // ✅ safe now
      formData.append('tags', JSON.stringify(tags));
      formData.append('coverImage', coverFile);

      await callApi('/api/articles', {
        method: 'POST',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Article created successfully!');
      setTimeout(() => router.push('/dashboard'), 400);
    } catch (err: any) {
      toast.error(err?.error || 'Failed to create article');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-2xl shadow-xl space-y-6">
      <Toaster position="top-right" />

      {/* Title */}
      <div className="flex flex-col">
        <label className="mb-1 text-indigo-900 font-semibold text-sm">
          Title
        </label>
        <input
          type="text"
          placeholder="Article Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 text-lg font-semibold rounded-xl bg-white border-2 border-indigo-300 placeholder-indigo-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-indigo-500 transition-all duration-300"
        />
      </div>

      {/* Category */}
      <div className="flex flex-col">
        <label className="mb-1 text-indigo-900 font-semibold text-sm">
          Category
        </label>
        <select
          value={categoryId ?? ''}
          onChange={(e) =>
            setCategoryId(e.target.value ? Number(e.target.value) : null)
          }
          className="w-full px-4 py-2 rounded-xl bg-white border-2 border-indigo-300 text-indigo-700 font-medium cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-indigo-500 transition-all duration-300"
        >
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Cover Image */}
      <label className="mb-1 text-indigo-900 font-semibold text-sm">
        Cover Image
      </label>
      <div
        className="border-2 border-dashed border-indigo-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition-all duration-300 relative flex flex-col items-center justify-center bg-white/30 backdrop-blur-sm"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        {coverFile ? (
          <div className="relative">
            <img
              src={URL.createObjectURL(coverFile)}
              alt="Cover"
              className="mx-auto h-40 object-contain rounded-xl shadow-md"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeCoverImage();
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 shadow"
            >
              ×
            </button>
          </div>
        ) : (
          <p className="text-indigo-500 font-medium">
            Drag & drop or click to upload cover image
          </p>
        )}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      {/* Tags */}
      <div className="space-y-3">
        <div className="flex gap-2 items-end">
          <div className="flex flex-col flex-1">
            <label className="mb-1 text-indigo-900 font-semibold text-sm">
              Tags
            </label>
            <input
              type="text"
              placeholder="Add tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              className="w-full px-3 py-2 border-2 border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-indigo-500 transition-all duration-300"
            />
          </div>
          <button
            type="button"
            onClick={handleAddTag}
            className="self-end h-[42px] px-6 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 text-white rounded-xl shadow hover:from-purple-500 hover:via-pink-500 hover:to-red-500 transition-all duration-300"
          >
            Add
          </button>
        </div>

        {/* Single Tag List */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full"
            >
              <span>#{tag}</span>
              <button
                onClick={() => handleRemoveTag(tag)}
                className="text-indigo-500 hover:text-red-500 transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col">
        <div className="max-w-4xl mx-auto mt-10">
          <h1 className="text-2xl font-bold mb-4">Write your article</h1>
          <LexicalEditor onChange={setContent} />
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full py-3 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 text-white rounded-xl hover:from-blue-500 hover:via-indigo-600 hover:to-purple-600 disabled:opacity-50 shadow transition-all duration-300 font-semibold"
      >
        {isSaving ? 'Saving...' : 'Save Article'}
      </button>
    </div>
  );
}
