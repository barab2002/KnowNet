import React, { useState } from 'react';
import {
  Post,
  toggleLike,
  toggleSave,
  addComment,
  getComments,
  deleteComment,
  summarizePost,
  deletePost,
  updatePost,
} from '../api/posts';
import { useAuth } from '../contexts/AuthContext';
import { Modal } from './Modal';
import { EditPostModal } from './EditPostModal';

interface PostCardProps {
  post: Post;
  onUpdate?: () => void; // Callback to refresh parent list
  onLikesUpdated?: () => void; // Refresh profile likes stats if needed
}

export const PostCard = React.memo(
  ({ post, onUpdate, onLikesUpdated }: PostCardProps) => {
  // We'll use local state for immediate feedback but rely on props for source of truth
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Post['comments']>([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Use local state for optimistic/immediate updates, sync with prop
  const [localPost, setLocalPost] = useState(post);
  const [localSummary, setLocalSummary] = useState(post.summary);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const carouselRef = React.useRef<HTMLDivElement | null>(null);

  // Sync local summary if prop updates (e.g. from parent refresh)
  React.useEffect(() => {
    setLocalPost(post);
    setLocalSummary(post.summary);
    setCommentsLoaded(false);
    setComments([]);
  }, [post]);

  const { user, token } = useAuth();
  const currentUserId = user?._id || '';

  // Handle Author Info (Support both populated object and legacy string ID)
  const authorIdStr =
    typeof localPost.authorId === 'object'
      ? localPost.authorId?._id
      : localPost.authorId;
  const authorName =
    typeof localPost.authorId === 'object' ? localPost.authorId?.name : null;
  const authorImage =
    typeof localPost.authorId === 'object'
      ? localPost.authorId?.profileImageUrl
      : null;

  // Fallback to current user if ID matches (for optimistic updates or legacy)
  const displayName =
    authorName || (authorIdStr === currentUserId ? user?.name : 'KnowNet User');
  const displayImage =
    authorImage ||
    (authorIdStr === currentUserId ? user?.profileImageUrl : null);

  const isLiked = localPost.likes.includes(currentUserId);
  const isSaved = localPost.savedBy.includes(currentUserId);

  const images = React.useMemo(() => {
    if (localPost.imageUrls && localPost.imageUrls.length > 0) {
      return localPost.imageUrls;
    }
    if (localPost.imageUrl) {
      return [localPost.imageUrl];
    }
    return [];
  }, [localPost.imageUrl, localPost.imageUrls]);

  const scrollImages = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const offset = direction === 'left' ? -420 : 420;
    carouselRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  const handleLike = async () => {
    try {
      if (!currentUserId) return;
      const updatedPost = await toggleLike(post._id, currentUserId);
      setLocalPost(updatedPost);
      if (onLikesUpdated) onLikesUpdated();
    } catch (err) {
      console.error('Failed to toggle like', err);
    }
  };

  const handleSave = async () => {
    try {
      if (!currentUserId) return;
      const updatedPost = await toggleSave(post._id, currentUserId);
      setLocalPost(updatedPost);
    } catch (err) {
      console.error('Failed to toggle save', err);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUserId) return;
    try {
      const updatedPost = await addComment(post._id, commentText, currentUserId);
      setLocalPost(updatedPost);
      setComments(updatedPost.comments || []);
      setCommentsLoaded(true);
      setCommentText('');
    } catch (err) {
      console.error('Failed to add comment', err);
    }
  };

  const handleDeleteComment = async (commentId?: string) => {
    if (!commentId) return;
    try {
      const updatedPost = await deleteComment(post._id, commentId, token);
      setLocalPost(updatedPost);
      setComments(updatedPost.comments || []);
      setCommentsLoaded(true);
    } catch (err) {
      console.error('Failed to delete comment', err);
    }
  };

  const handleToggleComments = async () => {
    const next = !showComments;
    setShowComments(next);
    if (next && !commentsLoaded) {
      try {
        setIsLoadingComments(true);
        const fetched = await getComments(post._id);
        setComments(fetched || []);
        setCommentsLoaded(true);
      } catch (err) {
        console.error('Failed to load comments', err);
      } finally {
        setIsLoadingComments(false);
      }
    }
  };

  const handleSummarize = async () => {
    try {
      setIsSummarizing(true);
      setError(null);
      const updatedPost = await summarizePost(post._id);

      if (updatedPost && updatedPost.summary) {
        setLocalSummary(updatedPost.summary);
        setLocalPost(updatedPost);
      } else {
        throw new Error('Unable to generate summary. Please try again.');
      }
    } catch (err: any) {
      console.error('Failed to summarize post', err);
      const msg = err.response?.data?.message || err.message || 'Unknown error';
      setError(`Failed: ${msg}`);
    } finally {
      setIsSummarizing(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await deletePost(post._id, currentUserId);
      setShowDeleteModal(false);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Failed to delete post', err);
      alert('Failed to delete post');
    }
  };

  const handleEditSave = async (
    content: string,
    images?: File[],
    removeImageUrls?: string[],
  ) => {
    try {
      const updatedPost = await updatePost(
        post._id,
        { content, removeImageUrls },
        images,
        token,
      );
      setLocalPost(updatedPost);
      setLocalSummary(updatedPost.summary);
      setShowEditModal(false);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Failed to update post', err);
      setError('Failed to update post. Please try again.');
    }
  };

  return (
    <>
      <article className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-primary/50 transition-colors">
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200">
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt="Author avatar"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="material-icons-round text-slate-400 text-3xl flex items-center justify-center h-full">
                    person
                  </span>
                )}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white leading-tight">
                  {displayName}
                </h4>
                <p className="text-xs text-slate-500">
                  {new Date(localPost.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {authorIdStr === currentUserId && (
                <>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="text-slate-400 hover:text-primary transition-colors p-1"
                    title="Edit Post"
                  >
                    <span className="material-icons-round text-xl">edit</span>
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    title="Delete Post"
                  >
                    <span className="material-icons-round text-xl">
                      delete_outline
                    </span>
                  </button>
                </>
              )}
              {/* Removed menu button */}
            </div>
          </div>

          {/* AI Summary Section */}
          {error && (
            <div className="bg-red-50 text-red-500 rounded-lg p-3 border-l-4 border-red-500 mb-4 text-sm animate-in fade-in">
              {error}
            </div>
          )}
          {localSummary && !error && (
            <div className="bg-primary/5 rounded-lg p-3 border-l-4 border-primary mb-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-primary text-xs font-bold mb-1 uppercase tracking-wider">
                <span className="material-symbols-outlined text-xs">
                  cognition_2
                </span>
                AI Summary
              </div>
              <p
                className="text-sm text-slate-700 dark:text-slate-300 italic"
                dir="auto"
              >
                "{localSummary}"
              </p>
            </div>
          )}

          <p
            className="text-slate-800 dark:text-slate-200 text-[15px] leading-relaxed mb-4"
            dir="auto"
          >
            {localPost.content}
          </p>

          {images.length > 0 && (
            <div className="relative rounded-xl overflow-hidden mb-4 border border-slate-100 dark:border-slate-800">
              <div
                ref={carouselRef}
                className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth"
              >
                {images.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="min-w-full snap-start"
                  >
                    <img
                      src={image}
                      alt="Post attachment"
                      className="w-full h-auto object-cover max-h-[500px]"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => scrollImages('left')}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 text-slate-700 w-9 h-9 flex items-center justify-center shadow"
                    title="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollImages('right')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 text-slate-700 w-9 h-9 flex items-center justify-center shadow"
                    title="Next image"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          )}

          {/* Tags Section with User vs AI distinction */}
          {((localPost.userTags && localPost.userTags.length > 0) ||
            (localPost.aiTags && localPost.aiTags.length > 0)) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {localPost.userTags?.map((tag, idx) => (
                <span
                  key={`user-${idx}`}
                  className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
              {localPost.aiTags?.map((tag, idx) => (
                <span
                  key={`ai-${idx}`}
                  className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-700 dark:text-slate-300 px-2 py-1 rounded flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[10px]">
                    cognition_2
                  </span>
                  #{tag}
                </span>
              ))}
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
              <span className="text-sm font-medium">
                {localPost.likes.length}
              </span>
            </button>
            <button
              onClick={handleToggleComments}
              className="flex items-center gap-1.5 text-slate-500 hover:text-primary transition-colors"
            >
              <span className="material-icons-round text-lg">
                chat_bubble_outline
              </span>
              <span className="text-sm font-medium">
                {localPost.comments.length}
              </span>
            </button>

            <button
              onClick={handleSummarize}
              disabled={isSummarizing}
              className="flex items-center gap-1.5 text-slate-500 hover:text-primary transition-colors disabled:opacity-50 relative group"
              title="Summarize"
            >
              {isSummarizing ? (
                <div className="w-6 h-6 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">
                  cognition_2
                </span>
              )}
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
                {isLoadingComments && (
                  <p className="text-xs text-slate-400 italic">
                    Loading comments...
                  </p>
                )}
                {!isLoadingComments && comments.map((comment, idx) => {
                  const commentName =
                    comment.userName ||
                    (comment.userId === currentUserId
                      ? user?.name
                      : 'KnowNet User');
                  const commentImage =
                    comment.userProfileImageUrl ||
                    (comment.userId === currentUserId
                      ? user?.profileImageUrl
                      : undefined);
                  const canDeleteComment =
                    comment.userId === currentUserId ||
                    authorIdStr === currentUserId;

                  return (
                    <div
                      key={idx}
                      className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg text-sm"
                    >
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                          {commentImage ? (
                            <img
                              src={commentImage}
                              alt="Comment author avatar"
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <span className="material-icons-round text-slate-400 text-xl flex items-center justify-center h-full">
                              person
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-xs text-slate-700 dark:text-slate-200">
                              {commentName}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-slate-400">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                              {canDeleteComment && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteComment(comment._id)}
                                  className="text-slate-400 hover:text-red-500 transition-colors"
                                  title="Delete comment"
                                >
                                  <span className="material-icons-round text-sm">
                                    delete_outline
                                  </span>
                                </button>
                              )}
                            </div>
                          </div>
                          <p
                            className="text-slate-800 dark:text-slate-200 mt-1"
                            dir="auto"
                          >
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {!isLoadingComments && comments.length === 0 && (
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
                  dir="auto"
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

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Post?"
      >
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Are you sure you want to delete this post? This action cannot be
            undone.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </Modal>

      <EditPostModal
        isOpen={showEditModal}
        initialContent={localPost.content}
        initialImageUrls={images}
        onClose={() => setShowEditModal(false)}
        onSave={handleEditSave}
      />
    </>
  );
});
