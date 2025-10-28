import React, { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  $isListNode,
} from '@lexical/list';
import { $getSelection, $isRangeSelection } from 'lexical';

type ListType = 'ordered' | 'unordered';

interface ListButtonProps {
  type: ListType;
}

export default function ListButton({ type }: ListButtonProps) {
  const [editor] = useLexicalComposerContext();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode();
          const parent = anchorNode.getParent();
          if (parent && $isListNode(parent)) {
            const currentType = parent.getListType(); // 'bullet' or 'number'
            setIsActive(
              (type === 'unordered' && currentType === 'bullet') ||
                (type === 'ordered' && currentType === 'number')
            );
          } else {
            setIsActive(false);
          }
        }
      });
    });
  }, [editor, type]);

  const handleClick = () => {
    editor.dispatchCommand(
      type === 'unordered'
        ? INSERT_UNORDERED_LIST_COMMAND
        : INSERT_ORDERED_LIST_COMMAND,
      undefined
    );
  };

  return (
    <button
      onClick={handleClick}
      className={`border rounded-md px-2 py-1 transition ${
        isActive
          ? 'bg-blue-500 text-white border-blue-600'
          : 'bg-gray-100 text-black border-gray-300 hover:bg-gray-200'
      }`}
    >
      {type === 'unordered' ? '•list' : 'num'}
    </button>
  );
}
