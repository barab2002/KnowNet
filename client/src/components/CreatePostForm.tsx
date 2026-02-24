import React, { useEffect, useRef, useState } from 'react';
import { createPost } from '../api/posts';
import { useAuth } from '../contexts/AuthContext';

const TAG_MODELS = [
  { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B', description: 'Best quality' },
  { id: 'llama-3.1-8b-instant',    label: 'Llama 3.1 8B',  description: 'Fastest' },
  { id: 'gemini-2.0-flash',        label: 'Gemini Flash',   description: 'Google' },
] as const;

type TagModelId = typeof TAG_MODELS[number]['id'];

interface CreatePostFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
  placeholder?: string;
  className?: string;
}

export const CreatePostForm: React.FC<CreatePostFormProps> = ({
  onSuccess,
  onCancel,
  showCancel = false,
  placeholder = "What's on your mind? Use #tags to reach communities...",
  className = '',
}) => {
  const { user } = useAuth();
  const [postText, setPostText] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiWarning, setAiWarning] = useState(false);
  const [tagModel, setTagModel] = useState<TagModelId>('llama-3.3-70b-versatile');
  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const modelMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!modelMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (modelMenuRef.current && !modelMenuRef.current.contains(e.target as Node)) {
        setModelMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [modelMenuOpen]);

  const defaultAvatar =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCvtexDhPhar8YHNlSTSnW4u-Cr6-wLTamZ6XqrJcCGbnv8HsimarRRtRyBOXOivrORYRp5w4dPCWMc7KGnm8X9k3kPAXU9d6G4gN-ayhLHw5yHnG5Mh4wYJRpprIH9Rm8Q56nNjDmxPmfrhn5OkejcNpGBpQHyRZNnCYuEozb0BKzo27GFFl5ZPMAKFtOY3Kybd8KWCrsbCGJYc977RMJ4LdWMuB3NpS4jMZy4Vl058nKZE5lgpsUsafPMMG57ba5uOyNwIkIKMg';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim()) return;

    try {
      setIsLoading(true);
      const result = await createPost(
        {
          content: postText,
          authorId: user?._id,
          tagModel,
        },
        images,
      );
      setPostText('');
      setImages([]);
      if ((result as any).aiQuotaExceeded) {
        setAiWarning(true);
        setTimeout(() => setAiWarning(false), 6000);
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to submit post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`bg-white/80 dark:bg-card-dark/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-white dark:border-slate-800 transition-all ${className}`}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-2">
          <div
            className="size-10 rounded-full bg-center bg-cover border border-slate-200 dark:border-slate-700"
            style={{
              backgroundImage: `url("${user?.profileImageUrl || defaultAvatar}")`,
            }}
          ></div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-sm">
              {user?.name || 'User'}
            </p>
            <p className="flex items-center gap-1 text-slate-500 text-xs">
              <span className="material-symbols-outlined text-[14px]">
                public
              </span>
              Public
            </p>
          </div>
        </div>

        {/* Text Input */}
        <div className="relative">
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder={placeholder}
            dir="auto"
            className="w-full min-h-[120px] p-4 bg-slate-50 dark:bg-[#233648]/50 border-none rounded-xl resize-none focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#92adc9] transition-all"
          />
        </div>

        {/* Image Preview */}
        {images.length > 0 && (
          <div className="relative mb-2">
            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth">
              {images.map((image, index) => (
                <div
                  key={`${image.name}-${index}`}
                  className="relative min-w-[220px] snap-start rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700"
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="w-full h-40 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setImages((prev) =>
                        prev.filter((_, idx) => idx !== index),
                      )
                    }
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-black/80 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Quota Warning */}
        {aiWarning && (
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg px-4 py-2 text-sm">
            <span className="material-symbols-outlined text-base">warning</span>
            AI quota exceeded — post saved without tags. Try again tomorrow.
          </div>
        )}

        {/* Action Toolbar */}
        <div className="flex flex-wrap gap-2 items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
          <div className="flex gap-1 items-center">
            <label
              className="p-2 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors group cursor-pointer"
              title="Add Image (Pictures Only)"
            >
              <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
                image
              </span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                className="hidden"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  const valid = files.filter((file) =>
                    file.type.startsWith('image/'),
                  );
                  if (files.length !== valid.length) {
                    alert(
                      'Please upload image files only (PNG, JPG, GIF, WEBP)',
                    );
                  }
                  if (valid.length > 0) {
                    setImages((prev) => [...prev, ...valid]);
                  }
                }}
              />
            </label>

            {/* AI Model Picker */}
            <div className="relative" ref={modelMenuRef}>
              <button
                type="button"
                onClick={() => setModelMenuOpen((o) => !o)}
                title="AI model for tag generation"
                className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-slate-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                <span className="hidden sm:inline">{TAG_MODELS.find((m) => m.id === tagModel)?.label ?? tagModel}</span>
                <span className="material-symbols-outlined text-[14px]">expand_more</span>
              </button>
              {modelMenuOpen && (
                <div className="absolute bottom-full left-0 mb-1 z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden min-w-[180px]">
                  {TAG_MODELS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => { setTagModel(m.id); setModelMenuOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-primary/10 ${tagModel === m.id ? 'text-primary font-semibold' : 'text-slate-700 dark:text-slate-200'}`}
                    >
                      <span className="block font-medium">{m.label}</span>
                      <span className="block text-xs text-slate-400">{m.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {showCancel && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-lg text-slate-500 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={!postText.trim() || isLoading}
              className="px-8 py-2 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
