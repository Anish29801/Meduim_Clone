'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { useApi } from '@/app/hooks/useApi';

interface Category {
  id: number;
  name: string;
}

export default function ArticleForm() {
  const router = useRouter();
  const { callApi } = useApi();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null); // ✅ binary file
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  // File selection
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

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('content', content);
      formData.append('categoryId', categoryId.toString());
      formData.append('authorId', '1'); // replace with logged-in user ID
      formData.append('tags', JSON.stringify(tags)); // form data allways accepts string data
      // tags.forEach((tag) => formData.append('tags', tag));
      formData.append('coverImage', coverFile); // ✅ append binary

      await callApi('/api/articles', {
        method: 'POST',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('✅ Article created successfully!');
      setTimeout(() => router.push('/dashboard'), 200);
    } catch (err: any) {
      toast.error(err?.error || 'Failed to create article');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-3xl shadow-xl space-y-8">
      <Toaster position="top-right" />

      <input
        type="text"
        placeholder="Article Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-6 py-4 text-2xl font-semibold border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
      />

      {/* Category */}
      <div className="relative">
        <select
          value={categoryId ?? ''}
          onChange={(e) =>
            setCategoryId(e.target.value ? Number(e.target.value) : null)
          }
          className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 appearance-none bg-white text-gray-700 font-medium cursor-pointer"
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
      <div
        className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-indigo-500 transition-all duration-300 relative flex flex-col items-center justify-center"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        {coverFile ? (
          <div className="relative">
            <img
              src={URL.createObjectURL(coverFile)}
              alt="Cover"
              className="mx-auto h-52 object-contain rounded-2xl shadow-lg"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeCoverImage();
              }}
              className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 shadow-md"
            >
              ×
            </button>
          </div>
        ) : (
          <p className="text-gray-400 font-medium">
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
      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <div
            key={tag}
            className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm"
          >
            {tag}{' '}
            <button type="button" onClick={() => handleRemoveTag(tag)}>
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Add tag"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
        />
        <button
          type="button"
          onClick={handleAddTag}
          className="px-5 py-3 bg-indigo-500 text-white rounded-2xl hover:bg-indigo-600 shadow-md transition-all duration-300"
        >
          Add
        </button>
      </div>

      {/* Content */}
      <textarea
        placeholder="Write your article..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-64 px-6 py-5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg resize-none transition-all duration-300 shadow-inner"
      />

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full py-4 bg-indigo-500 text-white rounded-2xl hover:bg-indigo-600 disabled:opacity-50 shadow-lg transition-all duration-300 text-lg font-semibold"
      >
        {isSaving ? 'Saving...' : 'Save Article'}
      </button>
    </div>
  );
}
