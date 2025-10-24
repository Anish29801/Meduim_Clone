'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import Toolbox from './Toolbar';
import { useEffect } from 'react';

import { CodeHighlightPlugin } from './plugins/CodeHighlightPlugin';
import { LinkPlugin } from './plugins/LinkPlugin';
import { LexicalEditorProps } from '@/app/type';

export default function LexicalEditor({
  initialContent = '',
  onChange,
  readOnly = false,
}: LexicalEditorProps) {
  const initialConfig = {
    namespace: 'AdvancedEditor',
    editable: !readOnly,
    theme: {
      paragraph: 'mb-3 text-gray-800 leading-relaxed',
      heading: {
        h1: 'text-3xl font-bold mt-4 mb-2 text-gray-900',
        h2: 'text-2xl font-semibold mt-3 mb-2 text-gray-800',
        h3: 'text-xl font-semibold mt-2 mb-1 text-gray-700',
      },
      quote: 'border-l-4 border-gray-300 pl-4 italic text-gray-600 my-2',
      list: {
        ul: 'list-disc ml-6 my-2',
        ol: 'list-decimal ml-6 my-2',
        listitem: 'mb-1',
      },
      code: 'font-mono bg-gray-100 p-1 rounded text-sm text-gray-800',
      link: 'text-blue-600 underline hover:text-blue-800',
    },
    onError(error: any) {
      console.error('Lexical error:', error);
    },
  };

  // Validate initialContent (if JSON)
  useEffect(() => {
    if (!initialContent) return;
    try {
      JSON.parse(initialContent);
    } catch {
      console.warn('Invalid initial content JSON - editor will start empty');
    }
  }, [initialContent]);

  const handleChange = (editorState: any) => {
    editorState.read(() => {
      const json = editorState.toJSON();
      if (onChange) onChange(JSON.stringify(json));
    });
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="border rounded-2xl shadow-md bg-white p-4 transition-all hover:shadow-lg duration-200">
        {!readOnly && <Toolbox />}

        <div className="prose max-w-none">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[220px] outline-none px-2 py-1 text-[16px]" />
            }
            placeholder={
              <div className="text-gray-400">Start writing your article...</div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>

        <CodeHighlightPlugin />
        <LinkPlugin />
        <HistoryPlugin />
        <OnChangePlugin onChange={handleChange} />
      </div>
    </LexicalComposer>
  );
}
