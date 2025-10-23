'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import Toolbox from './Toolbar';
import { useEffect } from 'react';

export interface LexicalEditorProps {
  initialContent?: string;
  onChange?: (val: string) => void;
  readOnly?: boolean;
}

export default function LexicalEditor({
  initialContent = '',
  onChange,
  readOnly = false,
}: LexicalEditorProps) {
  const initialConfig = {
    namespace: 'MyEditor',
    theme: {
      paragraph: 'mb-2 text-gray-800',
      heading: {
        h1: 'font-bold text-3xl',
        h2: 'font-bold text-2xl',
        h3: 'font-bold text-xl',
      },
    },
    editable: !readOnly,
    onError(error: any) {
      console.error('Lexical error:', error);
    },
  };

  // Sync initial content (if JSON string)
  useEffect(() => {
    if (!initialContent) return;
    try {
      JSON.parse(initialContent);
      // LexicalComposer handles initial state automatically
    } catch {
      console.warn('Invalid initial content JSON');
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
      <div className="border rounded-2xl shadow bg-white p-4">
        {!readOnly && <Toolbox />}

        <RichTextPlugin
          contentEditable={
            <ContentEditable className="min-h-[150px] outline-none" />
          }
          placeholder={
            <div className="text-gray-400">Type your article...</div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />

        <HistoryPlugin />
        <OnChangePlugin onChange={handleChange} />
      </div>
    </LexicalComposer>
  );
}
