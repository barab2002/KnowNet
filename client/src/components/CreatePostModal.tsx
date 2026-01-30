import React, { useState } from 'react';
import { Modal } from './Modal';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

import { createPost } from '../api/posts';

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [postText, setPostText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim()) return;

    try {
      setIsLoading(true);
      await createPost({ content: postText });
      setPostText('');
      onClose();
      // Optional: Trigger feed refresh (would need a callback or global state)
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to submit post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Post">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-2">
          <div
            className="size-10 rounded-full bg-center bg-cover"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBCsWsvVxGh1A9EZG1KcjZ6dq1MsebVYxiH7nNJ_FHxSWkPD2RIStyqIkKd3kajExWnQpv4Nez9uwzW65XP88YobR3UiPmnkTTncIAHMJGDBSrvX6XitFO48Oi7z__M3f5rcBpVXo4IzvYf1EKPV_hyeF8GG1TjHYvNOnHlmSrPsveZQKgiUE8HokzmwNHS9e6HSrYgHu8fiRsZ7ziGwRCnwYAa_lyjd54ilQAD4yWUyfnbqN6I_HuZz6RkRosLfheslnI8zM0esg")',
            }}
          ></div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-sm">
              Alex Rivera
            </p>
            <button
              type="button"
              className="flex items-center gap-1 text-slate-500 text-xs hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">
                public
              </span>
              Public
              <span className="material-symbols-outlined text-[14px]">
                arrow_drop_down
              </span>
            </button>
          </div>
        </div>

        {/* Text Input */}
        <div className="relative">
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="What's on your mind? Use #tags to reach communities..."
            className="w-full min-h-[120px] p-4 bg-slate-50 dark:bg-[#233648]/50 border-none rounded-xl resize-none focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#92adc9] transition-all"
          />
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap gap-2 items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
          <div className="flex gap-1">
            <button
              type="button"
              className="p-2 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors group"
              title="Add Image"
            >
              <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
                image
              </span>
            </button>
            <button
              type="button"
              className="p-2 text-slate-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors group"
              title="Add Poll"
            >
              <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
                poll
              </span>
            </button>
            <button
              type="button"
              className="p-2 text-slate-500 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors group"
              title="Add Event"
            >
              <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
                event
              </span>
            </button>
            <div className="w-[1px] h-8 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <button
              type="button"
              className="p-2 text-primary font-bold text-xs flex items-center gap-1 hover:bg-primary/10 rounded-lg transition-colors"
              title="AI Assist"
            >
              <span className="material-symbols-outlined text-[20px]">
                auto_awesome
              </span>
              <span className="hidden sm:inline">AI Allow</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-slate-500 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!postText.trim() || isLoading}
            className="px-6 py-2 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
