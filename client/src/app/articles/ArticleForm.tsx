'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { useApi } from '@/app/hooks/useApi';
import LexicalEditor from '../components/lecxicaleditor';
import ClientLayout from '../components/layouts/client-layout';

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

  // ✅ Load logged-in user
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserId(parsed?.id || null);
      } catch {
        console.error('Invalid user data in localStorage');
      }
    }
  }, []);

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
        toast.error('Failed to fetch categories');
      }
    }

    fetchCategories();
  }, [callApi]);

  // File handlers
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

  // ✅ Save article
  const handleSave = async () => {
    if (!title.trim()) return toast.error('Title is required!');
    if (!categoryId) return toast.error('Please select a category!');
    if (!coverFile) return toast.error('Please select a cover image!');
    if (!userId) return toast.error('User not logged in!');

    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('content', content);
      formData.append('categoryId', categoryId.toString());
      formData.append('authorId', userId.toString()); // ✅ dynamic user id
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
  console.log(categories);

  return (
    <ClientLayout>
      <div className="min-h-screen w-full bg-gradient-to-br from-white-100 via-white-100 to-white-100 flex items-start justify-evenly p-10">
        <div>
          {' '}
          {/* Header */}
          <div className="text-center space-y-1">
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
              📝 Create New Article
            </h2>
            <p className="text-gray-600">
              Fill in the details below to publish your article
            </p>
          </div>
          {/* Title */}
          <div className="flex flex-col">
            <label className="mb-2 text-indigo-900 font-semibold text-2xl">
              Title
            </label>
            <input
              type="text"
              placeholder="Article Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mb-2 w-full px-4 py-3 text-base rounded-xl bg-white/80 border border-indigo-200 placeholder-indigo-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-300"
            />
          </div>
          {/* Category */}
          <div className="flex flex-col">
            <label className="mb-2 text-indigo-900 font-semibold text-2xl">
              Category
            </label>
            <select
              value={categoryId ?? ''}
              onChange={(e) =>
                setCategoryId(e.target.value ? Number(e.target.value) : null)
              }
              className="w-full mb-2 px-4 py-3 rounded-xl bg-white/80 border border-indigo-200 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
            >
              <option value="">Select a category</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          {/* Cover Image */}
          <div className="flex flex-col">
            <label className="mb-2 text-indigo-900 font-semibold text-2xl">
              Cover Image
            </label>
            <div
              className="border-2 mb-2 border-dashed border-indigo-300 rounded-2xl p-6 text-center cursor-pointer hover:border-indigo-500 transition-all duration-300 bg-white/60 backdrop-blur-md relative"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              {coverFile ? (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(coverFile)}
                    alt="Cover"
                    className="mx-auto mb-2 h-48 object-cover rounded-xl shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCoverImage();
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 shadow-md"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <p className="text-indigo-600 font-medium">
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
          </div>
          {/* Tags */}
          <div className="space-y-3">
            <div className="flex gap-2 items-end">
              <div className="flex flex-col flex-1">
                <label className="mb-1 text-indigo-900 font-semibold text-2xl">
                  Tags
                </label>
                <input
                  type="text"
                  placeholder="Add tag and press Enter"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  className="w-full mb-2 px-4 py-3 border border-indigo-200 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
                />
              </div>
              <button
                type="button"
                onClick={handleAddTag}
                className="h-[46px] px-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl shadow hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 font-medium"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 px-3 py-1 rounded-full shadow-sm"
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
            <label className="mb-2 text-indigo-900 font-semibold text-2xl">
              Write your article
            </label>
            <div className="bg-white/80 rounded-xl shadow-inner p-4 border border-indigo-100">
              <LexicalEditor onChange={setContent} />
            </div>
          </div>
          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:via-blue-600 hover:to-purple-600 disabled:opacity-50 shadow-lg transition-all duration-300 font-semibold"
          >
            {isSaving ? 'Saving...' : 'Save Article'}
          </button>
        </div>
      </div>
    </ClientLayout>
  );
}
