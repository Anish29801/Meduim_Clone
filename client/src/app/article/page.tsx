import LexicalEditor from '@/app/components/lecxicaleditor';

export default function ArticlePage() {
  const handleEditorChange = (content: string) => {
    console.log('Article content JSON:', content);
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Create Article</h1>
      <LexicalEditor onChange={handleEditorChange} />
    </main>
  );
}
