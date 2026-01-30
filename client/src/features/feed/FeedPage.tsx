import React, { useEffect, useState } from 'react';
import { getPosts, Post } from '../../api/posts';
import { PostCard } from '../../components/PostCard';
import { CreatePostModal } from '../../components/CreatePostModal';
import { useAuth } from '../../contexts/AuthContext';

export const FeedPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user } = useAuth();

  const fetchPosts = () => {
    getPosts().then(setPosts).catch(console.error);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const defaultAvatar =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCvtexDhPhar8YHNlSTSnW4u-Cr6-wLTamZ6XqrJcCGbnv8HsimarRRtRyBOXOivrORYRp5w4dPCWMc7KGnm8X9k3kPAXU9d6G4gN-ayhLHw5yHnG5Mh4wYJRpprIH9Rm8Q56nNjDmxPmfrhn5OkejcNpGBpQHyRZNnCYuEozb0BKzo27GFFl5ZPMAKFtOY3Kybd8KWCrsbCGJYc977RMJ4LdWMuB3NpS4jMZy4Vl058nKZE5lgpsUsafPMMG57ba5uOyNwIkIKMg';

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
        {/* Create Post Trigger */}
        <div className="bg-white/80 dark:bg-card-dark/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-white dark:border-slate-800 transition-all hover:shadow-2xl hover:shadow-slate-300/50 dark:hover:border-primary/30 group">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-primary/20 p-0.5 transition-transform group-hover:scale-105">
              <img
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
                src={user?.profileImageUrl || defaultAvatar}
              />
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex-1 bg-slate-100 dark:bg-background-dark/50 text-slate-500 text-left px-6 rounded-2xl text-base hover:bg-slate-200 dark:hover:bg-background-dark transition-all border border-transparent hover:border-slate-300 dark:hover:border-slate-700 outline-none"
            >
              What knowledge would you like to share?
            </button>
          </div>
          <div className="flex justify-between mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/50">
            <div className="flex gap-2">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 text-sm font-bold px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                <span className="material-icons-round text-blue-500">
                  image
                </span>
                Upload Image
              </button>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-primary text-white px-8 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              Create Post
            </button>
          </div>
        </div>

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

        <CreatePostModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            fetchPosts();
          }}
        />

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
