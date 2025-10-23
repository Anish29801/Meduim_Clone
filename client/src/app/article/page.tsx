'use client';

import LexicalEditor from '@/app/components/lecxicaleditor';
import { useState, useEffect } from 'react';

export default function ArticlePage() {
  const [articleContent, setArticleContent] = useState('');
  const [previousContent, setPreviousContent] = useState('');

  // Client-side fetch from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('article') || '';
    setPreviousContent(saved);
  }, []);

  const handleEditorChange = (content: string) => {
    console.log('Article content JSON:', content);
    setArticleContent(content);
  };

  const handleSave = () => {
    localStorage.setItem('article', articleContent);
    alert('Article saved!');
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Create / Edit Article</h1>

      <LexicalEditor
        initialContent={previousContent}
        onChange={handleEditorChange}
      />

      <button
        onClick={handleSave}
        className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800"
      >
        Save Article
      </button>
    </main>
  );
}
