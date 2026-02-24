import React, { useMemo, useState } from 'react';
import { Modal } from './Modal';

interface EditPostModalProps {
  isOpen: boolean;
  initialContent: string;
  initialImageUrl?: string;
  onClose: () => void;
  onSave: (content: string, image?: File) => Promise<void> | void;
}

export const EditPostModal: React.FC<EditPostModalProps> = ({
  isOpen,
  initialContent,
  initialImageUrl,
  onClose,
  onSave,
}) => {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | undefined>(
    undefined,
  );

  React.useEffect(() => {
    if (isOpen) {
      setContent(initialContent);
      setSelectedImage(undefined);
    }
  }, [isOpen, initialContent]);

  const trimmed = useMemo(() => content.trim(), [content]);
  const isContentChanged = trimmed !== initialContent.trim();
  const isDisabled = trimmed.length === 0 || (!isContentChanged && !selectedImage);
  const previewUrl = useMemo(() => {
    if (selectedImage) {
      return URL.createObjectURL(selectedImage);
    }
    return initialImageUrl;
  }, [selectedImage, initialImageUrl]);

  const handleSave = async () => {
    if (isDisabled) return;
    try {
      setIsSaving(true);
      await onSave(trimmed, selectedImage);
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
            <span>Editing updates text and image</span>
            <span>{trimmed.length} chars</span>
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Post image
          </label>
          <div className="mt-2 space-y-2">
            {previewUrl ? (
              <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                <img
                  src={previewUrl}
                  alt="Post preview"
                  className="w-full max-h-64 object-cover"
                />
              </div>
            ) : (
              <p className="text-xs text-slate-400">No image attached.</p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setSelectedImage(e.target.files?.[0] || undefined)
              }
              className="text-sm text-slate-500"
            />
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
