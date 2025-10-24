'use client';

import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export function LinkPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    let unregister: (() => void) | null = null;
    try {
      const linkModule = require('@lexical/link');
      if (linkModule?.registerLink) {
        unregister = linkModule.registerLink(editor);
      }
    } catch (err) {
      console.warn('LinkPlugin: @lexical/link not available', err);
    }
    return () => {
      if (typeof unregister === 'function') unregister();
    };
  }, [editor]);

  return null;
}
