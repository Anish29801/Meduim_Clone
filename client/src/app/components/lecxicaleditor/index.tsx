'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import Toolbox from './Toolbar';
import { useEffect } from 'react';
import { LexicalEditorProps } from '@/app/type';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';

export default function LexicalEditor({
  initialContent = '',
  onChange,
  readOnly = false,
}: LexicalEditorProps) {
  const initialConfig = {
    namespace: 'AdvancedEditor',
    editable: !readOnly,
    theme: {},
    onError(error: any) {
      console.error('Lexical error:', error);
    },
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode],
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
        <Toolbox />
        <div className="prose max-w-none">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[150px] min-w-[700px] outline-none px-2 py-1 text-[16px]" />
            }
            placeholder={
              <div className="text-gray-400">Start writing your article...</div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <OnChangePlugin onChange={handleChange} />
      </div>
    </LexicalComposer>
  );
}
