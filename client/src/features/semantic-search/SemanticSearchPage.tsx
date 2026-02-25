import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { searchPosts, getAllTags, SearchResultPost } from '../../api/posts';
import { PostCard } from '../../components/PostCard';

export const SemanticSearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultPost[]>([]);
  const [expandedTags, setExpandedTags] = useState<string[]>([]);
  const [queryWords, setQueryWords] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedPost, setSelectedPost] = useState<SearchResultPost | null>(
    null,
  );

  // Tag autocomplete state
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!selectedPost) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPost(null);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [selectedPost]);

  // Detect #<word> at the end of the query and show matching tag suggestions
  const handleQueryChange = async (value: string) => {
    setQuery(value);
    setActiveSuggestion(-1);

    const hashMatch = value.match(/#(\w*)$/);
    if (!hashMatch) {
      setTagSuggestions([]);
      return;
    }

    const partial = hashMatch[1].toLowerCase();
    const allTags = await getAllTags();
    // Empty partial (#) → show all tags; otherwise filter by startsWith then contains
    const matches = partial
      ? allTags.filter(
          (t) =>
            t.toLowerCase().startsWith(partial) ||
            t.toLowerCase().includes(partial),
        )
      : allTags;
    setTagSuggestions(matches);
  };

  const applySuggestion = async (tag: string) => {
    // Replace the trailing #<partial> with the selected tag, then open next picker
    const newQuery = query.replace(/#\w*$/, `#${tag} #`);
    setQuery(newQuery);
    setActiveSuggestion(-1);
    inputRef.current?.focus();
    // Re-open with all tags so they can pick the next one immediately
    const allTags = await getAllTags();
    setTagSuggestions(allTags);
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    // Strip leading # from tag tokens so "#clownfish fish" searches "clownfish fish"
    const cleanedQuery = query.replace(/#(\w)/g, '$1').trim();

    setIsSearching(true);
    setHasSearched(true);
    try {
      const {
        expandedTags: tags,
        queryWords: words,
        results: posts,
      } = await searchPosts(cleanedQuery);
      setExpandedTags(tags);
      setQueryWords(words);
      setResults(posts);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (tagSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSuggestion((i) => Math.min(i + 1, tagSuggestions.length - 1));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSuggestion((i) => Math.max(i - 1, 0));
        return;
      }
      if (e.key === 'Enter' && activeSuggestion >= 0) {
        e.preventDefault();
        applySuggestion(tagSuggestions[activeSuggestion]);
        return;
      }
      if (e.key === 'Escape') {
        setTagSuggestions([]);
        return;
      }
      if (e.key === 'Tab' && tagSuggestions.length > 0) {
        e.preventDefault();
        applySuggestion(
          tagSuggestions[activeSuggestion >= 0 ? activeSuggestion : 0],
        );
        return;
      }
    }
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Green = exact word boundary match, yellow = partial/contains match
  const stripHtml = (value: string): string => {
    if (!value) return '';
    if (typeof window !== 'undefined' && 'DOMParser' in window) {
      const doc = new DOMParser().parseFromString(value, 'text/html');
      return (doc.body.textContent || '').trim();
    }
    return value.replace(/<[^>]*>/g, '').trim();
  };

  const renderHighlighted = (text: string): React.ReactNode => {
    if (!queryWords.length) return text;

    const escaped = queryWords.map((w) =>
      w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    );
    const regex = new RegExp(`(${escaped.join('|')})`, 'gi');

    const parts: { text: string; isMatch: boolean; isExact: boolean }[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          text: text.slice(lastIndex, match.index),
          isMatch: false,
          isExact: false,
        });
      }
      const before = match.index === 0 ? ' ' : text[match.index - 1];
      const after =
        match.index + match[0].length >= text.length
          ? ' '
          : text[match.index + match[0].length];
      const isExact = /\W/.test(before) && /\W/.test(after);
      parts.push({ text: match[0], isMatch: true, isExact });
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
      parts.push({
        text: text.slice(lastIndex),
        isMatch: false,
        isExact: false,
      });
    }

    return (
      <>
        {parts.map((p, i) =>
          p.isMatch ? (
            <mark
              key={i}
              className={
                p.isExact
                  ? 'bg-emerald-500/30 text-emerald-900 dark:text-emerald-100 rounded px-0.5 font-bold'
                  : 'bg-amber-500/30 text-amber-900 dark:text-amber-100 rounded px-0.5 font-bold'
              }
            >
              {p.text}
            </mark>
          ) : (
            <span key={i}>{p.text}</span>
          ),
        )}
      </>
    );
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="w-full max-w-[960px] px-6 py-10">
          {/* Headline Section */}
          <div className="text-center mb-8">
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
                  ref={inputRef}
                  className="form-input flex w-full min-w-0 flex-1 border-none bg-transparent focus:ring-0 px-4 text-lg font-normal placeholder:text-slate-400 dark:placeholder:text-[#92adc9]"
                  inputMode="search"
                  data-testid="semantic-search-input"
                  placeholder="Ask anything... or type # for tag autocomplete"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={() => setTimeout(() => setTagSuggestions([]), 150)}
                  autoComplete="off"
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

            {/* Tag Autocomplete Dropdown */}
            {tagSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 text-xs text-slate-400 flex items-center justify-between">
                  <span>
                    {tagSuggestions.length} tag
                    {tagSuggestions.length !== 1 ? 's' : ''} — click to add, Esc
                    to close
                  </span>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {tagSuggestions.map((tag, i) => (
                    <button
                      key={tag}
                      type="button"
                      onMouseDown={() => applySuggestion(tag)}
                      className={`w-full text-left px-4 py-2 flex items-center gap-2 text-sm transition-colors ${
                        i === activeSuggestion
                          ? 'bg-primary/10 text-primary'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-primary/10 hover:text-primary'
                      }`}
                    >
                      <span className="text-primary font-bold text-xs">#</span>
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <p className="text-[#92adc9] text-xs font-normal leading-normal text-center pt-2">
            ✨ Understanding context, intent, and community sentiment
          </p>

          {/* Results Section */}
          {hasSearched && (
            <div className="mt-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#233648] pb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold leading-tight tracking-tight">
                    {results.length > 0
                      ? `Found ${results.length} Relevant Results`
                      : 'No results found'}
                  </h3>
                  {isSearching && (
                    <div className="size-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
              </div>

              {results.map((post) => (
                <div
                  key={post._id}
                  className="bg-white dark:bg-[#1a2632] rounded-xl p-5 border border-slate-200 dark:border-[#233648] hover:border-primary/50 transition-all group shadow-sm"
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
                    <div className="relative group/score">
                      <div
                        className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full border cursor-help transition-all shadow-sm ${
                          post._score >= 0.8
                            ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                            : 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                        }`}
                      >
                        <span className="material-symbols-outlined text-xs">
                          {post._score >= 0.8 ? 'verified' : 'analytics'}
                        </span>
                        Score: {Math.min(Math.round(post._score * 100), 100)}%
                      </div>

                      {/* Hover Explanation Tooltip */}
                      <div className="absolute bottom-full right-0 mb-2 w-48 p-3 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover/score:opacity-100 group-hover/score:visible transition-all duration-200 z-[60] text-xs pointer-events-none">
                        <p className="font-bold text-slate-800 dark:text-white mb-2 pb-1 border-b border-slate-100 dark:border-slate-700">
                          Relevance Breakdown
                        </p>
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                            <span>Semantic Match</span>
                            <span className="font-mono text-primary font-bold">
                              {Math.round((post._debug?.vScore || 0) * 100)}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                            <span>Textual Match</span>
                            <span className="font-mono text-emerald-500 font-bold">
                              {Math.round((post._debug?.mScore || 0) * 100)}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                            <span>Tag Synergy</span>
                            <span className="font-mono text-amber-500 font-bold">
                              {Math.round((post._debug?.tScore || 0) * 100)}%
                            </span>
                          </div>
                        </div>
                        <p className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 text-[10px] text-slate-400 italic">
                          Calculated using AI embeddings, literal patterns, and
                          tagging metadata.
                        </p>
                      </div>
                    </div>
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

                  <h4
                    className="text-lg font-bold mb-2 hover:text-primary transition-colors line-clamp-2 cursor-pointer"
                    onClick={() => setSelectedPost(post)}
                  >
                    {stripHtml(post.content).length > 100
                      ? stripHtml(post.content).substring(0, 100) + '...'
                      : stripHtml(post.content)}
                  </h4>

                  {post.summary && (
                    <div className="bg-primary/5 rounded-lg p-3 border-l-4 border-primary mb-3">
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

                  {post.matchSnippet && (
                    <div
                      className={`rounded-lg p-3 border-l-4 mb-4 ${
                        post.textMatchExact
                          ? 'bg-emerald-500/10 border-emerald-500'
                          : 'bg-amber-500/10 border-amber-500'
                      }`}
                    >
                      <div
                        className={`flex items-center gap-2 text-xs font-bold mb-1 uppercase tracking-wider ${
                          post.textMatchExact
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        <span className="material-symbols-outlined text-xs">
                          {post.textMatchExact ? 'target' : 'search'}
                        </span>
                        {post.textMatchExact ? 'Direct Match' : 'Partial Match'}
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 font-mono">
                        {renderHighlighted(stripHtml(post.matchSnippet))}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, idx) => {
                      const isExact = post.exactMatchedTags?.includes(tag);
                      const isContains =
                        post.containsMatchedTags?.includes(tag);
                      return (
                        <span
                          key={idx}
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            isExact
                              ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700'
                              : isContains
                                ? 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700'
                                : 'text-primary bg-primary/10'
                          }`}
                        >
                          #{tag}
                          {isExact && (
                            <span className="material-symbols-outlined text-[10px] ml-1 align-middle">
                              check
                            </span>
                          )}
                          {isContains && (
                            <span className="material-symbols-outlined text-[10px] ml-1 align-middle">
                              search
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

      {selectedPost &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setSelectedPost(null)}
            />
            {/* Panel */}
            <div className="relative w-full max-w-4xl h-full max-h-[80vh] flex flex-col bg-white dark:bg-[#1a2632] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden m-auto">
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 z-[110] bg-slate-900/40 hover:bg-slate-900/70 text-white p-1.5 rounded-full transition-all backdrop-blur-md flex items-center justify-center shadow-md border border-white/10"
                title="Close"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                <PostCard
                  post={selectedPost}
                  onUpdate={() => {
                    setResults((prev) =>
                      prev.filter((p) => p._id !== selectedPost._id),
                    );
                    setSelectedPost(null);
                  }}
                />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default SemanticSearchPage;
