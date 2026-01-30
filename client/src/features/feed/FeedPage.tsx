import React, { useEffect, useState } from 'react';
import { getPosts, Post } from '../../api/posts';
import { PostCard } from '../../components/PostCard';
import { CreatePostModal } from '../../components/CreatePostModal';

export const FeedPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchPosts = () => {
    getPosts().then(setPosts).catch(console.error);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-9 gap-6">
      {/* Main Content Feed */}
      <div className="col-span-9 md:col-span-6 space-y-6">
        {/* Create Post Trigger */}
        <div className="bg-white dark:bg-card-dark rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
              <img
                alt="Profile"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_4nrruZU9T_Pv6aK5TQQkd6xu7pEDZYSguwuvgD44WmsF1nBVE5Y1BfbeI287Lp8WIb04g379pjrWaevtFhoLTzKM4-7rT_Y_YtuKZY9FWm8HaWkEmf3uHTrAgFkyRE2ycyTSY69scwpDHmfhH1Wl9F9NtoBdEknQDmSr7bHUjz0umMjxRarNCsWQFEycdabga1gABPA2K14wGzkfBowJXzCkHJkRU6HFzcmoYx9whP755nkbEaXmUizVsXySydPKFAtRtkJWpA"
              />
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex-1 bg-slate-100 dark:bg-background-dark/50 text-slate-500 text-left px-5 rounded-full text-sm hover:bg-slate-200 dark:hover:bg-background-dark transition-colors"
            >
              Share something smart with your peers...
            </button>
          </div>
          <div className="flex justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex gap-2">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <span className="material-icons-round text-blue-500 text-sm">
                  image
                </span>
                Media
              </button>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-primary text-white px-5 py-1.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Post
            </button>
          </div>
        </div>

        {posts.map((post) => (
          <PostCard key={post._id} post={post} onUpdate={fetchPosts} />
        ))}

        <CreatePostModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            fetchPosts();
          }}
        />

        {/* Existing Static Posts (Optional: keep or remove, I'll remove for now to prove dynamic working) */}

        {/* Infinite Scroll Loader */}
        <div className="py-8 flex flex-col items-center gap-3">
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-.3s]"></div>
            <div className="w-2 h-2 bg-primary/30 rounded-full animate-bounce [animation-delay:-.5s]"></div>
          </div>
          <p className="text-xs font-medium text-slate-400">
            AI is curating more for you...
          </p>
        </div>
      </div>

      {/* Right Side Panel */}
      <aside className="col-span-9 md:col-span-3 hidden lg:block space-y-6">
        {/* AI Insights Panel */}
        <div className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-icons-round text-primary">
              psychology
            </span>
            <h3 className="font-bold text-sm tracking-tight">
              Personalized Insights
            </h3>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 dark:bg-background-dark rounded-lg">
              <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-tighter">
                Your Week
              </p>
              <p className="text-sm">
                You've engaged with 4 posts about{' '}
                <span className="text-primary font-medium">
                  Machine Learning
                </span>{' '}
                today.
              </p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-background-dark rounded-lg">
              <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-tighter">
                Campus Vibe
              </p>
              <p className="text-sm text-amber-600 dark:text-amber-400">
                High activity around "Library Renovations" topic.
              </p>
            </div>
          </div>
        </div>
        {/* Smart Recommendations */}
        <div className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-5">
          <h3 className="font-bold text-sm mb-4">Who to follow</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg overflow-hidden">
                  <img
                    alt="User"
                    className="w-full h-full object-cover"
                    data-alt="Portrait of a female researcher"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3-9qxdy8URqD5_UeDQ5jo3gp68CNJHNBXRhoMqlIAUfx9Pyj8jIScJlFzX3eEMhgD2XAQ2XYR6zWmW-PyiXRqFezvpCZLtEd2Ng8R9nd-C5dlrsIGoBhDC9PJU3pUwku21YKWMoh50wZzRcK-hZ91lYLiFl4AIyZzclMiQLCIV9To0pZEV3ZboDRIANrs-ZZykesCyf6c-yIJAE-Kjv37MCrys_VZYCzwYluK9HUL8g6dilldCHpJL43bPa8wOE7ww7oHgQoNHA"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold leading-none">Prof. Miller</p>
                  <p className="text-[10px] text-slate-500">Biology Dept.</p>
                </div>
              </div>
              <button className="text-[10px] font-bold text-primary hover:underline">
                FOLLOW
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg overflow-hidden">
                  <img
                    alt="User"
                    className="w-full h-full object-cover"
                    data-alt="Portrait of a male graduate student"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCug2HEWJzv_oJqIzDMGVH9hTVb1O5AEsYe8yo-WKKDU8j1KL22UKZT7362bCU222IxFyBo8c3SlTfNCb-z8v1T5fSp01atpzZZovn1_52JRP2Dg8qFyCyE6jWGSDXuwPzJBuBdRBrqLZjDqOXTrrFzPQnUO3pqLxwpG4_aGJZIArmPrnl77_lKlT9eIFZp6zQ3QxxlnQvdTD-a5xOSxFS5jPCwI6BNBbsiOALICY5BZaXlIWgXlZJWhv3OH8720pBPsZy0oDDDHQ"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold leading-none">Alex Rivera</p>
                  <p className="text-[10px] text-slate-500">Grad Student</p>
                </div>
              </div>
              <button className="text-[10px] font-bold text-primary hover:underline">
                FOLLOW
              </button>
            </div>
          </div>
        </div>
        {/* Copyright/Links */}
        <div className="px-5 text-[10px] text-slate-400 space-y-1">
          <div className="flex flex-wrap gap-x-2">
            <a className="hover:underline" href="#">
              Privacy Policy
            </a>
            <a className="hover:underline" href="#">
              Terms of Service
            </a>
            <a className="hover:underline" href="#">
              Campus Guidelines
            </a>
          </div>
          <p>© 2024 KnowNet AI Platform</p>
        </div>
      </aside>
    </div>
  );
};

export default FeedPage;
