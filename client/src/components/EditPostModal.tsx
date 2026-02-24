import React, { useMemo, useState } from 'react';
import { Modal } from './Modal';

interface EditPostModalProps {
  isOpen: boolean;
  initialContent: string;
  onClose: () => void;
  onSave: (content: string) => Promise<void> | void;
}

export const EditPostModal: React.FC<EditPostModalProps> = ({
  isOpen,
  initialContent,
  onClose,
  onSave,
}) => {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setContent(initialContent);
    }
  }, [isOpen, initialContent]);

  const trimmed = useMemo(() => content.trim(), [content]);
  const isDisabled = trimmed.length === 0 || trimmed === initialContent.trim();

  const handleSave = async () => {
    if (isDisabled) return;
    try {
      setIsSaving(true);
      await onSave(trimmed);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Post">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Post text
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="mt-2 w-full rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Update your post text..."
            dir="auto"
          />
          <div className="mt-1 text-xs text-slate-400 flex justify-between">
            <span>Editing only updates the text</span>
            <span>{trimmed.length} chars</span>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isDisabled || isSaving}
            className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
