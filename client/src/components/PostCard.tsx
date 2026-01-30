import React, { useState } from 'react';
import { Post, toggleLike, toggleSave, addComment } from '../api/posts';
import { useAuth } from '../contexts/AuthContext';

interface PostCardProps {
  post: Post;
  onUpdate?: () => void; // Callback to refresh parent list
}

export const PostCard: React.FC<PostCardProps> = ({ post, onUpdate }) => {
  // We'll use local state for immediate feedback but rely on props for source of truth
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const { user } = useAuth();
  const currentUserId = user?._id || '';

  const isLiked = post.likes.includes(currentUserId);
  const isSaved = post.savedBy.includes(currentUserId);

  const handleLike = async () => {
    try {
      if (!currentUserId) return;
      await toggleLike(post._id, currentUserId);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Failed to toggle like', err);
    }
  };

  const handleSave = async () => {
    try {
      if (!currentUserId) return;
      await toggleSave(post._id, currentUserId);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Failed to toggle save', err);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUserId) return;
    try {
      await addComment(post._id, commentText, currentUserId);
      setCommentText('');
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Failed to add comment', err);
    }
  };

  return (
    <article className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-primary/50 transition-colors">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200">
              {post.authorId === currentUserId && user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt="Author avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="material-icons-round text-slate-400 text-3xl flex items-center justify-center h-full">
                  person
                </span>
              )}
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white leading-tight">
                {post.authorId === currentUserId
                  ? user?.name || 'You'
                  : 'KnowNet User'}
              </h4>
              <p className="text-xs text-slate-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button className="text-slate-400 hover:text-primary">
            <span className="material-icons-round">more_horiz</span>
          </button>
        </div>

        {/* AI Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-lg border border-primary/20"
            >
              <span className="material-icons-round text-[12px]">
                auto_awesome
              </span>{' '}
              {tag.toUpperCase()}
            </span>
          ))}
        </div>

        <p className="text-slate-800 dark:text-slate-200 text-[15px] leading-relaxed mb-4">
          {post.content}
        </p>

        {post.imageUrl && (
          <div className="rounded-xl overflow-hidden mb-4 border border-slate-100 dark:border-slate-800">
            <img
              src={post.imageUrl}
              alt="Post attachment"
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>
        )}

        <div className="flex items-center gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-500'}`}
          >
            <span className="material-icons-round text-lg">
              {isLiked ? 'favorite' : 'favorite_border'}
            </span>
            <span className="text-sm font-medium">{post.likes.length}</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 text-slate-500 hover:text-primary transition-colors"
          >
            <span className="material-icons-round text-lg">
              chat_bubble_outline
            </span>
            <span className="text-sm font-medium">{post.comments.length}</span>
          </button>
          <div className="flex-1"></div>
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 transition-colors ${isSaved ? 'text-primary' : 'text-slate-500 hover:text-primary'}`}
          >
            <span className="material-icons-round text-lg">
              {isSaved ? 'bookmark' : 'bookmark_border'}
            </span>
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-2">
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {post.comments.map((comment, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg text-sm"
                >
                  <span className="font-bold text-xs text-slate-500 mr-2">
                    User {comment.userId.slice(0, 4)}
                  </span>
                  <span className="text-slate-800 dark:text-slate-200">
                    {comment.content}
                  </span>
                </div>
              ))}
              {post.comments.length === 0 && (
                <p className="text-xs text-slate-400 italic">
                  No comments yet.
                </p>
              )}
            </div>
            <form onSubmit={handleComment} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 text-sm bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="text-primary font-bold text-sm disabled:opacity-50"
              >
                Post
              </button>
            </form>
          </div>
        )}
      </div>
    </article>
  );
};
