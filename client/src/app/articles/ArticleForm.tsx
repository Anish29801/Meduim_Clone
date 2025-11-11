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
      <div className="flex flex-col h-screen bg-[#fafafa] overflow-y-auto">
        {/* ===== Top Bar ===== */}
        <header className="sticky top-0 z-20 px-10 py-4 flex items-center justify-between ">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              📝 Create New Article
            </h2>
            <p className="text-gray-500 text-sm">
              Fill in the details below to publish your article
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full disabled:opacity-50 transition-all"
          >
            {isSaving ? 'Saving...' : 'Publish'}
          </button>
        </header>

        {/* ===== Main Content ===== */}
        <main className="flex flex-1 px-10 overflow-hidden">
          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 flex-1 overflow-y-auto">
            {/* ===== LEFT PANEL (Meta Info) ===== */}
            <aside className="lg:col-span-1 md-5 space-y-8 sticky top-24 self-start">
              {/* Title */}
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mb-5 text-5xl font-serif font-semibold bg-transparent border-none focus:outline-none placeholder-gray-400"
              />

              {/* Category */}
              <div>
                <label className="block mb-2 text-gray-900 font-extralight">
                  Category
                </label>
                <select
                  value={categoryId ?? ''}
                  onChange={(e) =>
                    setCategoryId(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className="w-full mb-5 bg-white border border-gray-200 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-gray-400 focus:outline-none transition"
                >
                  <option value="">Select category</option>
                  {categories?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block mb-2 text-gray-900 font-extralight">
                  Tags
                </label>

                {/* Input + Add Button */}
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                    className="flex-1 mb-5 px-4 py-3 bg-white rounded-lg text-base border border-gray-200 focus:ring-2 focus:ring-gray-300 focus:outline-none transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-5 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition text-sm"
                  >
                    Add
                  </button>
                </div>

                {/* Tag Chips */}
                <div className="flex flex-wrap gap-3 mt-2">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm hover:bg-gray-200 transition"
                    >
                      <span className="font-medium">#{tag}</span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block mb-2 text-gray-900 font-extralight">
                  Cover Image
                </label>

                <div
                  className="rounded-xl bg-gray-50 hover:bg-gray-100 p-6 text-center transition-all cursor-pointer border border-gray-200 hover:border-gray-300"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {coverFile ? (
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(coverFile)}
                        alt="Cover"
                        className="mx-auto mb-3 h-56 w-full object-cover rounded-xl shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCoverImage();
                        }}
                        className="absolute top-3 right-3 bg-gray-800 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-500 transition-all"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 text-gray-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 16.5v-9m0 0L9 9m3-1.5l3 1.5m-7.5 8.25h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0016.5 4.5h-9A2.25 2.25 0 005.25 6.75v9a2.25 2.25 0 002.25 2.25z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-600 text-sm font-medium">
                        Drag & drop or{' '}
                        <span className="text-gray-900 font-semibold">
                          click to upload
                        </span>
                      </p>
                    </div>
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
            </aside>

            {/* ===== RIGHT PANEL (Lexical Editor) ===== */}
            <section className="lg:col-span-2 bg-white rounded-xl p-2 flex flex-col flex-1">
              <label className="block mb-3 text-gray-800 font-medium text-lg">
                Write your story
              </label>

              <div className="flex-1 bg-white p-4 overflow-y-auto">
                <LexicalEditor onChange={setContent} />
              </div>
            </section>
          </div>
        </main>
      </div>
    </ClientLayout>
  );
}
