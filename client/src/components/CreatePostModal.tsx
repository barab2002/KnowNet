import React, { useState } from 'react';
import { Modal } from './Modal';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

import { createPost } from '../api/posts';
import { useAuth } from '../contexts/AuthContext';

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const [postText, setPostText] = useState('');
  const [image, setImage] = useState<File | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const defaultAvatar =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCvtexDhPhar8YHNlSTSnW4u-Cr6-wLTamZ6XqrJcCGbnv8HsimarRRtRyBOXOivrORYRp5w4dPCWMc7KGnm8X9k3kPAXU9d6G4gN-ayhLHw5yHnG5Mh4wYJRpprIH9Rm8Q56nNjDmxPmfrhn5OkejcNpGBpQHyRZNnCYuEozb0BKzo27GFFl5ZPMAKFtOY3Kybd8KWCrsbCGJYc977RMJ4LdWMuB3NpS4jMZy4Vl058nKZE5lgpsUsafPMMG57ba5uOyNwIkIKMg';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim()) return;

    try {
      setIsLoading(true);
      await createPost(
        {
          content: postText,
          authorId: user?._id, // Include the user ID
        },
        image,
      );
      setPostText('');
      setImage(undefined);
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
            placeholder="What's on your mind? Use #tags to reach communities..."
            className="w-full min-h-[120px] p-4 bg-slate-50 dark:bg-[#233648]/50 border-none rounded-xl resize-none focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#92adc9] transition-all"
          />
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap gap-2 items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
          <div className="flex gap-1">
            {/* Image Preview */}
            {image && (
              <div className="relative mb-4">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setImage(undefined)}
                  className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            )}

            <div className="flex gap-1">
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
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && file.type.startsWith('image/')) {
                      setImage(file);
                    } else {
                      alert(
                        'Please upload an image file only (PNG, JPG, GIF, WEBP)',
                      );
                    }
                  }}
                />
              </label>
              <div className="w-[1px] h-8 bg-slate-200 dark:bg-slate-700 mx-1"></div>
              <button
                type="button"
                className="p-2 text-primary font-bold text-xs flex items-center gap-1 hover:bg-primary/10 rounded-lg transition-colors"
                title="AI Assist"
              >
                <span className="material-symbols-outlined text-[20px]">
                  auto_awesome
                </span>
                <span className="hidden sm:inline">AI Assist</span>
              </button>
            </div>
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
