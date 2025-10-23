'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import Toolbar from './Toolbar';
import { LexicalEditorProps } from '@/app/type';
import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

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
        h1: 'font-bold text-3xl mb-2',
        h2: 'font-bold text-2xl mb-2',
        h3: 'font-bold text-xl mb-2',
      },
    },
    editable: !readOnly,
    onError(error: any) {
      console.error('Lexical error:', error);
    },
  };

  const handleChange = (editorState: any) => {
    editorState.read(() => {
      const json = editorState.toJSON();
      if (onChange) onChange(JSON.stringify(json));
    });
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <EditorContent
        initialContent={initialContent}
        handleChange={handleChange}
        readOnly={readOnly}
      />
    </LexicalComposer>
  );
}

// Separate component to access editor instance
function EditorContent({ initialContent, handleChange, readOnly }: any) {
  const [editor] = useLexicalComposerContext();

  // Prefill initial content
  useEffect(() => {
    if (initialContent && editor) {
      editor.update(() => {
        const json = JSON.parse(initialContent);
        editor.setEditorState(editor.parseEditorState(json));
      });
    }
  }, [initialContent, editor]);

  return (
    <div className="border rounded-2xl shadow bg-white p-4">
      {!readOnly && <Toolbar />}
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="min-h-[150px] outline-none" />
        }
        placeholder={<div className="text-gray-400">Type your article...</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <OnChangePlugin onChange={handleChange} />
    </div>
  );
}
