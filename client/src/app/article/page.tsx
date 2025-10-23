'use client';

import LexicalEditor from '@/app/components/lecxicaleditor';

export default function WritePage() {
  const handleEditorChange = (content: string) => {
    console.log('Article content JSON:', content);
  };

  return (
    <main className="min-h-screen bg-white px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create a New Article</h1>
        <LexicalEditor onChange={handleEditorChange} />
      </div>
    </main>
  );
}
