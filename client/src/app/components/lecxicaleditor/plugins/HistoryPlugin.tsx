import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { UNDO_COMMAND, REDO_COMMAND } from 'lexical';

export function HistoryButtons() {
  const [editor] = useLexicalComposerContext();

  const handleUndo = () => editor.dispatchCommand(UNDO_COMMAND, undefined);
  const handleRedo = () => editor.dispatchCommand(REDO_COMMAND, undefined);

  return (
    <div className="flex gap-2">
      <div>
        <button
          onClick={handleUndo}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          {' '}
          ↩{' '}
        </button>
      </div>

      <button
        onClick={handleRedo}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        {' '}
        ↪{' '}
      </button>
    </div>
  );
}
