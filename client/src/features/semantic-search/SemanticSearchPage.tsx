import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { searchPosts, SearchResultPost } from '../../api/posts';
import { PostCard } from '../../components/PostCard';

export const SemanticSearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultPost[]>([]);
  const [expandedTags, setExpandedTags] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedPost, setSelectedPost] = useState<SearchResultPost | null>(null);

  useEffect(() => {
    if (!selectedPost) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedPost(null); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [selectedPost]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    try {
      const { expandedTags: tags, results: posts } = await searchPosts(query);
      setExpandedTags(tags);
      setResults(posts);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
    <div className="flex flex-col items-center">
      <div className="w-full max-w-[960px] px-6 py-10">
        {/* Headline Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 border border-primary/20">
            <span className="material-symbols-outlined text-sm">
              colors_spark
            </span>
            AI-POWERED SEARCH
          </div>
          <h1 className="text-[40px] font-bold leading-tight tracking-tight mb-2">
            How can we help you today?
          </h1>
          <p className="text-slate-500 dark:text-[#92adc9] text-lg">
            Search through community wisdom using natural language.
          </p>
        </div>

        {/* Search Bar Area */}
        <div className="relative group mb-2 focus-within:shadow-[0_0_15px_rgba(19,127,236,0.3)] transition-shadow duration-300 rounded-xl">
          <label className="flex flex-col w-full h-16">
            <div className="flex w-full flex-1 items-stretch rounded-xl overflow-hidden bg-white dark:bg-[#233648] shadow-xl border border-slate-200 dark:border-transparent">
              <div className="text-primary flex items-center justify-center pl-5">
                <span className="material-symbols-outlined text-[28px]">
                  search
                </span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 border-none bg-transparent focus:ring-0 px-4 text-lg font-normal placeholder:text-slate-400 dark:placeholder:text-[#92adc9]"
                placeholder="Ask anything... e.g., 'study spots', 'exam tips'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <div className="flex items-center pr-3">
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 disabled:opacity-70"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>
          </label>
        </div>
        <p className="text-[#92adc9] text-xs font-normal leading-normal text-center pt-2">
          ✨ Understanding context, intent, and community sentiment
        </p>


        {/* Results Section */}
        {hasSearched && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#233648] pb-4">
              <h3 className="text-lg font-bold leading-tight tracking-tight">
                {results.length > 0
                  ? `Found ${results.length} Results`
                  : 'No results found'}
              </h3>
            </div>

            {results.map((post) => (
              <div
                key={post._id}
                onClick={() => setSelectedPost(post)}
                className="bg-white dark:bg-[#1a2632] rounded-xl p-5 border border-slate-200 dark:border-[#233648] hover:border-primary/50 transition-all group shadow-sm cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center text-slate-500">
                      {typeof post.authorId === 'object' &&
                      post.authorId?.profileImageUrl ? (
                        <img
                          src={post.authorId.profileImageUrl}
                          alt="Author avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="material-symbols-outlined">
                          person
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        {typeof post.authorId === 'object'
                          ? post.authorId?.name
                          : 'KnowNet User'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-[#92adc9]">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {post.matchedTags.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
                      <span className="material-symbols-outlined text-xs">
                        verified
                      </span>
                      {post.matchedTags.length} tag{post.matchedTags.length > 1 ? 's' : ''} matched
                    </div>
                  )}
                </div>

                {post.imageUrl && (
                  <div className="mb-4 rounded-lg overflow-hidden h-48 w-full">
                    <img
                      src={post.imageUrl}
                      alt="Post content"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <h4 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.content.length > 100
                    ? post.content.substring(0, 100) + '...'
                    : post.content}
                </h4>

                {post.summary && (
                  <div className="bg-primary/5 rounded-lg p-3 border-l-4 border-primary mb-4">
                    <div className="flex items-center gap-2 text-primary text-xs font-bold mb-1 uppercase tracking-wider">
                      <span className="material-symbols-outlined text-xs">
                        summarize
                      </span>
                      AI Summary
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 italic">
                      "{post.summary}"
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, idx) => {
                    const isMatched = post.matchedTags.includes(tag);
                    return (
                      <span
                        key={idx}
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          isMatched
                            ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700'
                            : 'text-primary bg-primary/10'
                        }`}
                      >
                        #{tag}
                        {isMatched && (
                          <span className="material-symbols-outlined text-[10px] ml-1 align-middle">
                            check
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>

                <div className="flex items-center gap-4 text-slate-400">
                  <button className="flex items-center gap-1 text-xs hover:text-primary">
                    <span className="material-symbols-outlined text-sm">
                      thumb_up
                    </span>{' '}
                    {post.likes.length}
                  </button>
                  <button className="flex items-center gap-1 text-xs hover:text-primary">
                    <span className="material-symbols-outlined text-sm">
                      chat_bubble
                    </span>{' '}
                    {post.comments.length}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    {selectedPost && createPortal(
      <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-12 overflow-y-auto">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setSelectedPost(null)}
        />
        {/* Panel */}
        <div className="relative w-full max-w-2xl mb-12">
          <button
            onClick={() => setSelectedPost(null)}
            className="absolute -top-8 right-0 flex items-center gap-1 text-white/70 hover:text-white text-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
            Close
          </button>
          <PostCard
            post={selectedPost}
            onUpdate={() => {
              setResults((prev) => prev.filter((p) => p._id !== selectedPost._id));
              setSelectedPost(null);
            }}
          />
        </div>
      </div>,
      document.body
    )}
    </>
  );
};

export default SemanticSearchPage;
