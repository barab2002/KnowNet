import React from 'react';

export const PostSkeleton = () => {
  return (
    <article className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="p-5 animate-pulse">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3 w-full">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700"></div>
            <div className="space-y-2 flex-1 max-w-[200px]">
              {/* Name */}
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
              {/* Date */}
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>

        {/* Content lines */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/6"></div>
        </div>

        {/* Image placeholder */}
        <div className="rounded-xl overflow-hidden mb-4 border border-slate-100 dark:border-slate-800 h-64 bg-slate-200 dark:bg-slate-700"></div>

        {/* Actions */}
        <div className="flex items-center gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="flex-1"></div>
          <div className="h-6 w-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    </article>
  );
};
