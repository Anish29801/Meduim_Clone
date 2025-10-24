'use client';

import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export function CodeHighlightPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    let unregister: (() => void) | null = null;
    try {
      const codeModule = require('@lexical/code');
      if (codeModule?.registerCodeHighlighting) {
        unregister = codeModule.registerCodeHighlighting(editor);
      }
    } catch (err) {
      console.warn('CodeHighlightPlugin: @lexical/code not available', err);
    }
    return () => {
      if (typeof unregister === 'function') unregister();
    };
  }, [editor]);

  return null;
}
