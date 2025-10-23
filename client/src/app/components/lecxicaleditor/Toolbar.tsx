import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND, TextFormatType } from 'lexical';

export default function Toolbar() {
  const [editor] = useLexicalComposerContext();

  const applyFormat = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  return (
    <div className="flex gap-2 mb-2">
      <button
        onClick={() => applyFormat('bold')}
        className="px-2 py-1 bg-gray-200 rounded"
      >
        B
      </button>
      <button
        onClick={() => applyFormat('italic')}
        className="px-2 py-1 bg-gray-200 rounded"
      >
        I
      </button>
      <button
        onClick={() => applyFormat('underline')}
        className="px-2 py-1 bg-gray-200 rounded"
      >
        U
      </button>
    </div>
  );
}
