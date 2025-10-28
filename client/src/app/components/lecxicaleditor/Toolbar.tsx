'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND, TextFormatType } from 'lexical';
import { useState, useEffect } from 'react';
import { $getSelection, $isRangeSelection } from 'lexical';
import { HistoryButtons } from './plugins/HistoryPlugin';
import { HeadSubButton } from './plugins/HeadSubhead';
import ListButton from './plugins/Lists';

export default function Toolbox() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  const applyFormat = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  useEffect(() => {
    const unregisterUpdate = editor.registerUpdateListener(
      ({ editorState }) => {
        editorState.read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
          } else {
            setIsBold(false);
            setIsItalic(false);
          }
        });
      }
    );
    return () => {
      unregisterUpdate();
    };
  }, [editor]);

  return (
    <div className="flex items-center gap-2 mb-3 border-b pb-2">
      <HistoryButtons />
      <button
        onClick={() => applyFormat('bold')}
        aria-pressed={isBold}
        className={`px-3 py-1 rounded transition ${
          isBold ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
        }`}
      >
        B
      </button>
      <button
        onClick={() => applyFormat('italic')}
        aria-pressed={isItalic}
        className={`px-3 py-1 rounded transition ${
          isItalic ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
        }`}
      >
        I
      </button>
      <HeadSubButton />
      <ListButton type="unordered" />
      <ListButton type="ordered" />
    </div>
  );
}
