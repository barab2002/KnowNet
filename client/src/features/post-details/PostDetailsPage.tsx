import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPostById, Post } from '../../api/posts';
import { PostCard } from '../../components/PostCard';

export const PostDetailsPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPost = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const p = await getPostById(id);
      setPost(p);
    } catch (err) {
      console.error('Failed to load post', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return <div className="py-20 text-center">Post not found.</div>;
  }

  return (
    <div className="flex flex-col font-display">
      <nav className="flex items-center gap-2 mb-6 text-sm py-4">
        <a className="text-slate-400 dark:text-[#92adc9] hover:text-primary transition-colors" href="#">Home</a>
        <span className="text-slate-300 dark:text-[#233648] material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-slate-900 dark:text-white font-medium">Post Details</span>
      </nav>

      <div className="max-w-3xl mx-auto">
        <PostCard post={post} onUpdate={fetchPost} />
      </div>
    </div>
  );
};

export default PostDetailsPage;
