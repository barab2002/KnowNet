import React, { useState, useEffect, useRef } from 'react';
import { CreatePostModal } from '../../components/CreatePostModal';
import { EditProfileModal } from '../../components/EditProfileModal';
import { PostCard } from '../../components/PostCard';
import {
  getMyPosts,
  getLikedPosts,
  getSavedPosts,
  getTotalLikesForUser,
  Post,
} from '../../api/posts';
import { getUserProfile, uploadProfileImage, User } from '../../api/users';
import { useAuth } from '../../contexts/AuthContext';

export const UserProfilePage = () => {
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'liked' | 'saved'>(
    'posts',
  );
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user: authUser, updateUser } = useAuth();

  // Use the ID from the logged-in user
  const currentUserId = authUser?._id || '';

  const fetchUserProfile = async () => {
    if (!currentUserId) return;

    setIsLoadingUser(true);
    try {
      const userData = await getUserProfile(currentUserId);
      const actualLikes = await getTotalLikesForUser(currentUserId);
      setUser({ ...userData, likesReceived: actualLikes });
    } catch (error) {
      console.error(
        'Failed to fetch user profile, using auth fallback:',
        error,
      );
      // Fallback to auth context data if backend profile missing
      if (authUser) {
        const actualLikes = await getTotalLikesForUser(currentUserId).catch(
          () => 0,
        );
        setUser({
          _id: authUser._id,
          name: authUser.name,
          email: authUser.email,
          profileImageUrl: authUser.profileImageUrl,
          joinedDate: new Date().toISOString(),
          postsCount: 0,
          likesReceived: actualLikes,
          aiSummariesCount: 0,
          bio: authUser.bio || 'Welcome to KnowNet!',
          major: authUser.major,
          graduationYear: authUser.graduationYear,
        });
      }
    } finally {
      setIsLoadingUser(false);
    }
  };

  const fetchPosts = async () => {
    if (!currentUserId) return;

    let promise;
    switch (activeTab) {
      case 'posts':
        promise = getMyPosts(currentUserId);
        break;
      case 'liked':
        promise = getLikedPosts(currentUserId);
        break;
      case 'saved':
        promise = getSavedPosts(currentUserId);
        break;
    }
    promise?.then(setPosts).catch(console.error);
  };

  useEffect(() => {
    fetchUserProfile();
  }, [currentUserId]);

  useEffect(() => {
    fetchPosts();
  }, [activeTab, currentUserId]);

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setIsUploadingImage(true);
    try {
      await uploadProfileImage(currentUserId, file);
      await fetchUserProfile();
    } catch (error) {
      console.error('Failed to upload profile image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const formatJoinedDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  if (isLoadingUser) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-8 px-4 overflow-y-auto">
      <div className="max-w-[800px] w-full flex flex-col gap-6">
        {/* Profile Header */}
        <div className="bg-white dark:bg-[#192633] rounded-xl p-6 border border-slate-200 dark:border-[#324d67]">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <div
                className="relative group cursor-pointer"
                onClick={handleProfileImageClick}
              >
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-32 border-4 border-white dark:border-[#111a22] shadow-xl"
                  style={{
                    backgroundImage: user?.profileImageUrl
                      ? `url(${user.profileImageUrl})`
                      : 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBQPXmIOuVihMlkDxHc6ggkIwxa8pHz6wUHk8NzM4y3qz2wVP_CNZTIlzowu9sdjBfXkM1ubIyAhGV0EaBsO3z5qHvfxnAIM0p0Mu-mXVMHUoVs0GfrXdi0RKYWT-z2CIosIU8i4MUqONJnFRsTKncgVedx4scCoJQqJ4OS0mYVL-AA1GAt_dkoMGVhpFXn4NoEm27SN2KIBb7RAgj4WvJ4MxeFOjBBkjYG6nZcBjWXXFUUEDaaaVdZ3PvJ0y_zVcOohFdTy5QM2Q")',
                  }}
                ></div>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {isUploadingImage ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  ) : (
                    <span className="material-symbols-outlined text-white">
                      photo_camera
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                <h2 className="text-2xl font-bold leading-tight">
                  {user?.name || 'Anonymous User'}
                </h2>
                <button
                  onClick={() => setIsEditProfileModalOpen(true)}
                  className="flex items-center justify-center gap-2 rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold transition-all hover:bg-primary/90"
                >
                  <span className="material-symbols-outlined text-sm">
                    edit
                  </span>
                  <span>Edit Profile</span>
                </button>
              </div>
              <p className="text-slate-600 dark:text-[#92adc9] text-base font-normal">
                {user?.major && user?.graduationYear
                  ? `${user.major} | ${user.graduationYear}`
                  : user?.major || user?.graduationYear || 'Student'}
              </p>
              {user?.bio && (
                <p className="text-slate-700 dark:text-[#92adc9] text-sm mt-2 max-w-md">
                  {user.bio}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2 text-slate-500 dark:text-[#92adc9] text-sm">
                <span className="material-symbols-outlined text-sm">
                  calendar_month
                </span>
                <span>
                  Joined{' '}
                  {user?.joinedDate
                    ? formatJoinedDate(user.joinedDate)
                    : 'Recently'}
                </span>
              </div>
            </div>
          </div>
          {/* Profile Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 border-t border-slate-100 dark:border-[#324d67] pt-6">
            <div className="flex flex-col gap-1 rounded-2xl bg-slate-50 dark:bg-[#192633] border border-slate-200 dark:border-[#324d67] p-5 transition-all hover:border-primary/30 group">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-sm text-blue-500 font-bold">
                  article
                </span>
                <p className="text-slate-500 dark:text-[#92adc9] text-[10px] font-extrabold uppercase tracking-widest">
                  Total Posts
                </p>
              </div>
              <p className="text-3xl font-black leading-tight text-slate-900 dark:text-white">
                {user?.postsCount || 0}
              </p>
            </div>
            <div className="flex flex-col gap-1 rounded-2xl bg-slate-50 dark:bg-[#192633] border border-slate-200 dark:border-[#324d67] p-5 transition-all hover:border-pink-500/30 group ring-2 ring-pink-500/5">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-sm text-pink-500 font-bold">
                  favorite
                </span>
                <p className="text-slate-500 dark:text-[#92adc9] text-[10px] font-extrabold uppercase tracking-widest">
                  Total Likes
                </p>
              </div>
              <p className="text-3xl font-black leading-tight text-slate-900 dark:text-white">
                {user?.likesReceived || 0}
              </p>
            </div>
            <div className="flex flex-col gap-1 rounded-2xl bg-slate-50 dark:bg-[#192633] border border-slate-200 dark:border-[#324d67] p-5 transition-all hover:border-amber-500/30 group col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-sm text-amber-500 font-bold">
                  auto_awesome
                </span>
                <p className="text-slate-500 dark:text-[#92adc9] text-[10px] font-extrabold uppercase tracking-widest">
                  AI Insights
                </p>
              </div>
              <p className="text-3xl font-black leading-tight text-slate-900 dark:text-white">
                {user?.aiSummariesCount || 0}
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
            <PostCard
              key={post._id}
              post={post}
              onUpdate={() => {
                fetchPosts();
                fetchUserProfile();
              }}
            />
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
          fetchUserProfile(); // Refresh to update post count
        }}
      />
      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        user={user}
        onUpdate={fetchUserProfile}
      />
    </div>
  );
};

export default UserProfilePage;
