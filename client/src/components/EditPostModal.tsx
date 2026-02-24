import React, { useMemo, useRef, useState } from 'react';
import { Modal } from './Modal';

interface EditPostModalProps {
  isOpen: boolean;
  initialContent: string;
  initialImageUrl?: string;
  onClose: () => void;
  onSave: (content: string, image?: File, removeImage?: boolean) => Promise<void> | void;
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
  const [removeImage, setRemoveImage] = useState(false);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setContent(initialContent);
      setSelectedImage(undefined);
      setRemoveImage(false);
    }
  }, [isOpen, initialContent]);

  const trimmed = useMemo(() => content.trim(), [content]);
  const isContentChanged = trimmed !== initialContent.trim();
  const isDisabled =
    trimmed.length === 0 || (!isContentChanged && !selectedImage && !removeImage);
  const previewUrl = useMemo(() => {
    if (!selectedImage) return undefined;
    return URL.createObjectURL(selectedImage);
  }, [selectedImage]);

  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const images = useMemo(() => {
    const items: {
      key: string;
      src: string;
      type: 'current' | 'new';
    }[] = [];
    if (initialImageUrl && !removeImage) {
      items.push({ key: 'current', src: initialImageUrl, type: 'current' });
    }
    if (previewUrl) {
      items.push({ key: 'new', src: previewUrl, type: 'new' });
    }
    return items;
  }, [initialImageUrl, removeImage, previewUrl]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const offset = direction === 'left' ? -280 : 280;
    carouselRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  const handleSave = async () => {
    if (isDisabled) return;
    try {
      setIsSaving(true);
      await onSave(trimmed, selectedImage, removeImage);
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
            {images.length > 0 ? (
              <div className="relative">
                <div
                  ref={carouselRef}
                  className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth"
                >
                  <label className="relative min-w-[200px] snap-start rounded-lg overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setSelectedImage(e.target.files?.[0] || undefined)
                      }
                      className="hidden"
                    />
                    <span className="text-2xl text-slate-400">+</span>
                  </label>
                  {images.map((image) => (
                    <div
                      key={image.key}
                      className="relative min-w-[240px] snap-start rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700"
                    >
                      <img
                        src={image.src}
                        alt="Post preview"
                        className="w-full h-40 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (image.type === 'current') {
                            setRemoveImage(true);
                          } else {
                            setSelectedImage(undefined);
                          }
                        }}
                        className="absolute top-2 right-2 rounded-full bg-black/60 text-white w-7 h-7 flex items-center justify-center hover:bg-black/80"
                        title="Remove image"
                      >
                        ✕
                      </button>
                      <div className="absolute bottom-2 left-2 text-[11px] px-2 py-0.5 rounded-full bg-black/60 text-white">
                        {image.type === 'current' ? 'Current' : 'New'}
                      </div>
                    </div>
                  ))}
                </div>
                {images.length > 1 && (
                  <div className="absolute inset-y-0 left-0 flex items-center">
                    <button
                      type="button"
                      onClick={() => scrollCarousel('left')}
                      className="ml-1 rounded-full bg-white/80 text-slate-700 w-7 h-7 flex items-center justify-center shadow"
                      title="Scroll left"
                    >
                      ‹
                    </button>
                  </div>
                )}
                {images.length > 1 && (
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <button
                      type="button"
                      onClick={() => scrollCarousel('right')}
                      className="mr-1 rounded-full bg-white/80 text-slate-700 w-7 h-7 flex items-center justify-center shadow"
                      title="Scroll right"
                    >
                      ›
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No image attached.</p>
            )}
            {images.length > 1 && (
              <p className="text-[11px] text-slate-400">
                Scroll horizontally to switch between images.
              </p>
            )}
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
