'use client';

import { useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { EditorState } from 'lexical';
import Toolbox from './Toolbar';
import { LexicalEditorProps } from '@/app/type';

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

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <EditorContent
        initialContent={initialContent}
        onChange={onChange}
        readOnly={readOnly}
      />
    </LexicalComposer>
  );
}

function EditorContent({
  initialContent,
  onChange,
  readOnly,
}: {
  initialContent: string;
  onChange?: (json: string) => void;
  readOnly?: boolean;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!initialContent) return;

    try {
      const parsed = JSON.parse(initialContent);
      const editorState = editor.parseEditorState(parsed);
      editor.setEditorState(editorState);
    } catch {
      const fallbackJSON: any = {
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: initialContent,
                  type: 'text',
                  version: 1,
                },
              ],
              direction: null,
              format: '',
              indent: 0,
              type: 'paragraph',
              version: 1,
              textFormat: 0,
              textStyle: '',
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          type: 'root',
          version: 1,
          textFormat: 0,
          textStyle: '',
        },
      };
      const editorState = editor.parseEditorState(fallbackJSON);
      editor.setEditorState(editorState);
    }
  }, [initialContent, editor]);

  const handleChange = (editorState: EditorState) => {
    editorState.read(() => {
      const json = editorState.toJSON();
      onChange?.(JSON.stringify(json));
    });
  };

  return (
    <div className="border rounded-2xl shadow-md bg-white p-4 transition-all hover:shadow-lg duration-200">
      {!readOnly && <Toolbox />}
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
  );
}
