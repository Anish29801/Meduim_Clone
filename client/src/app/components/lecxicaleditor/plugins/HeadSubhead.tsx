import React from 'react';
import { useState, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
} from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode, HeadingNode } from '@lexical/rich-text';
import { $isHeadingNode } from '@lexical/rich-text';
import { $isRootOrShadowRoot } from 'lexical';

type Props = {
  setRawJson?: (value: string) => string;
};
export function HeadSubButton({ setRawJson }: Props) {
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] = useState<'paragraph' | 'h1' | 'h2' | 'h3'>(
    'paragraph'
  );

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode();
          if ($isRootOrShadowRoot(anchorNode)) return;
          const element = anchorNode.getTopLevelElementOrThrow();
          const type = element.getType();

          if ($isHeadingNode(element)) {
            setBlockType(element.getTag() as 'h1' | 'h2' | 'h3');
          } else {
            setBlockType('paragraph');
          }
        }
      });
    });
  }, [editor]);

  const setHeading = (tag: 'h1' | 'h2' | 'h3' | 'paragraph') => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      if (tag === 'paragraph') {
        $setBlocksType(selection, () => $createParagraphNode());
      } else {
        $setBlocksType(selection, () => $createHeadingNode(tag));
      }
    });
  };

  const getButtonStyle = (tag: string) =>
    blockType === tag
      ? 'bg-blue-500 text-white border-blue-600'
      : 'bg-gray-100 text-black border-gray-300 hover:bg-gray-200';
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setHeading('h1')}
        className={`border rounded-md px-2 py-1 ${getButtonStyle('h1')}`}
      >
        H1
      </button>
      <button
        onClick={() => setHeading('h2')}
        className={`border rounded-md px-2 py-1 ${getButtonStyle('h2')}`}
      >
        H2
      </button>
      <button
        onClick={() => setHeading('h3')}
        className={`border rounded-md px-2 py-1 ${getButtonStyle('h3')}`}
      >
        H3
      </button>
    </div>
  );
}
