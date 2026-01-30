import React, { useEffect, useState } from 'react';
import { getPosts, Post } from '../../api/posts';
import { PostCard } from '../../components/PostCard';
import { useAuth } from '../../contexts/AuthContext';
import { CreatePostForm } from '../../components/CreatePostForm';

export const FeedPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { user } = useAuth();

  const fetchPosts = () => {
    getPosts().then(setPosts).catch(console.error);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      {/* Welcome Header */}
      <div className="animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
          Welcome back, {user?.name?.split(' ')[0] || 'Scholar'}! 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Here's what's happening across KnowNet today.
        </p>
      </div>

      <div className="space-y-6">
        {/* Inline Create Post Form */}
        <CreatePostForm
          onSuccess={fetchPosts}
          placeholder="What knowledge would you like to share today?"
        />

        {posts.length > 0 ? (
          <div className="flex flex-col gap-6 animate-in fade-in duration-1000">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onUpdate={fetchPosts} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-4 bg-slate-50 dark:bg-card-dark/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="size-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <span className="material-icons-round text-3xl">post_add</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No posts yet
              </h3>
              <p className="text-slate-500 text-sm">
                Be the first to share something with your peers!
              </p>
            </div>
          </div>
        )}

        {/* Infinite Scroll Loader */}
        {posts.length > 5 && (
          <div className="py-12 flex flex-col items-center gap-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-duration:800ms]"></div>
              <div className="w-3 h-3 bg-primary/60 rounded-full animate-bounce [animation-duration:800ms] [animation-delay:-.3s]"></div>
              <div className="w-3 h-3 bg-primary/30 rounded-full animate-bounce [animation-duration:800ms] [animation-delay:-.5s]"></div>
            </div>
            <p className="text-sm font-bold text-slate-400 tracking-wider uppercase">
              Curating more insights...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedPage;
