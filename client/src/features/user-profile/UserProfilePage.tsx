import React, { useState, useEffect } from 'react';
import { CreatePostModal } from '../../components/CreatePostModal';
import { PostCard } from '../../components/PostCard';
import {
  getMyPosts,
  getLikedPosts,
  getSavedPosts,
  Post,
} from '../../api/posts';

export const UserProfilePage = () => {
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'liked' | 'saved'>(
    'posts',
  );
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = () => {
    let promise;
    switch (activeTab) {
      case 'posts':
        promise = getMyPosts();
        break;
      case 'liked':
        promise = getLikedPosts();
        break;
      case 'saved':
        promise = getSavedPosts();
        break;
    }
    promise?.then(setPosts).catch(console.error);
  };

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  return (
    <div className="flex justify-center py-8 px-4 overflow-y-auto">
      <div className="max-w-[800px] w-full flex flex-col gap-6">
        {/* Profile Header */}
        <div className="bg-white dark:bg-[#192633] rounded-xl p-6 border border-slate-200 dark:border-[#324d67]">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative group cursor-pointer">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-32 border-4 border-white dark:border-[#111a22] shadow-xl"
                data-alt="Detailed close-up of male student avatar"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBQPXmIOuVihMlkDxHc6ggkIwxa8pHz6wUHk8NzM4y3qz2wVP_CNZTIlzowu9sdjBfXkM1ubIyAhGV0EaBsO3z5qHvfxnAIM0p0Mu-mXVMHUoVs0GfrXdi0RKYWT-z2CIosIU8i4MUqONJnFRsTKncgVedx4scCoJQqJ4OS0mYVL-AA1GAt_dkoMGVhpFXn4NoEm27SN2KIBb7RAgj4WvJ4MxeFOjBBkjYG6nZcBjWXXFUUEDaaaVdZ3PvJ0y_zVcOohFdTy5QM2Q")',
                }}
              ></div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white">
                  photo_camera
                </span>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                <h2 className="text-2xl font-bold leading-tight">
                  Alex Johnson
                </h2>
                <button className="flex items-center justify-center gap-2 rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold transition-all hover:bg-primary/90">
                  <span className="material-symbols-outlined text-sm">
                    edit
                  </span>
                  <span>Edit Profile</span>
                </button>
              </div>
              <p className="text-slate-600 dark:text-[#92adc9] text-base font-normal">
                Computer Science | Class of 2025
              </p>
              <div className="flex items-center gap-2 mt-2 text-slate-500 dark:text-[#92adc9] text-sm">
                <span className="material-symbols-outlined text-sm">
                  calendar_month
                </span>
                <span>Joined September 2022</span>
              </div>
            </div>
          </div>
          {/* Profile Stats */}
          <div className="flex flex-wrap gap-4 mt-8 border-t border-slate-100 dark:border-[#324d67] pt-6">
            <div className="flex flex-1 min-w-[120px] flex-col gap-1 rounded-xl bg-slate-50 dark:bg-transparent border border-slate-200 dark:border-[#324d67] p-4">
              <p className="text-2xl font-bold leading-tight">42</p>
              <p className="text-slate-500 dark:text-[#92adc9] text-xs font-medium uppercase tracking-wider">
                Posts
              </p>
            </div>
            <div className="flex flex-1 min-w-[120px] flex-col gap-1 rounded-xl bg-slate-50 dark:bg-transparent border border-slate-200 dark:border-[#324d67] p-4">
              <p className="text-2xl font-bold leading-tight">1.2k</p>
              <p className="text-slate-500 dark:text-[#92adc9] text-xs font-medium uppercase tracking-wider">
                Likes
              </p>
            </div>
            <div className="flex flex-1 min-w-[120px] flex-col gap-1 rounded-xl bg-slate-50 dark:bg-transparent border border-slate-200 dark:border-[#324d67] p-4">
              <p className="text-2xl font-bold leading-tight">15</p>
              <p className="text-slate-500 dark:text-[#92adc9] text-xs font-medium uppercase tracking-wider">
                AI Summaries
              </p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-slate-200 dark:border-[#324d67] flex gap-8">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-2 border-b-2 pb-3 pt-2 transition-colors ${activeTab === 'posts' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-primary'}`}
          >
            <span className="material-symbols-outlined text-[20px]">
              article
            </span>
            <p className="text-sm font-bold tracking-tight">My Posts</p>
          </button>
          <button
            onClick={() => setActiveTab('liked')}
            className={`flex items-center gap-2 border-b-2 pb-3 pt-2 transition-colors ${activeTab === 'liked' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-primary'}`}
          >
            <span className="material-symbols-outlined text-[20px]">
              favorite
            </span>
            <p className="text-sm font-bold tracking-tight">Liked Posts</p>
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 border-b-2 pb-3 pt-2 transition-colors ${activeTab === 'saved' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-primary'}`}
          >
            <span className="material-symbols-outlined text-[20px]">
              bookmark
            </span>
            <p className="text-sm font-bold tracking-tight">Saved Posts</p>
          </button>
        </div>

        {/* Feed Area */}
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onUpdate={fetchPosts} />
          ))}

          {posts.length === 0 && (
            <p className="text-center text-slate-500 py-10">No posts found.</p>
          )}

          {/* Create New Post Prompt */}
          <div className="mt-4 p-8 border-2 border-dashed border-slate-200 dark:border-[#324d67] rounded-xl flex flex-col items-center justify-center gap-4 text-center">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">add_circle</span>
            </div>
            <div>
              <p className="font-bold">Share something new</p>
              <p className="text-sm text-slate-500 dark:text-[#92adc9]">
                Your thoughts could help fellow students.
              </p>
            </div>
            <button
              onClick={() => setIsCreatePostModalOpen(true)}
              className="bg-primary text-white px-6 py-2 rounded-lg font-bold text-sm hover:scale-105 active:scale-95 transition-transform"
            >
              Create Post
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => {
          setIsCreatePostModalOpen(false);
          fetchPosts();
        }}
      />
    </div>
  );
};

export default UserProfilePage;
