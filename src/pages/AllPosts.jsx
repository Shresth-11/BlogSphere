import React, { useState, useEffect } from "react";
import appwriteService from "../appwrite/config";
import { Container, PostCard } from "../components";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    appwriteService.getPosts([]).then((posts) => {
      if (posts) {
        setPosts(posts.documents);
      }
      setLoading(false);
    });
  }, []);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.author && post.author.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full py-12 select-none">
      <Container>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-slate-200 dark:border-zinc-900 pb-6 w-full text-left">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-violet-400">
              Explore Content
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Discover Inspiring Articles
            </h1>
            <p className="text-slate-600 dark:text-zinc-400 text-sm sm:text-base max-w-xl font-medium">
              Browse our community articles written by innovators, storytellers, and designers.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search articles or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 text-sm font-medium focus:outline-none focus:border-indigo-600 dark:focus:border-violet-500 shadow-sm transition-all"
            />
            <svg
              className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {loading ? (
          /* Loading State */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800/80 p-4 h-80 flex flex-col justify-between"
              >
                <div className="w-full aspect-[16/10] rounded-xl bg-slate-200 dark:bg-zinc-900" />
                <div className="h-6 rounded-md bg-slate-200 dark:bg-zinc-900 w-3/4 mt-4" />
                <div className="h-4 rounded-md bg-slate-200 dark:bg-zinc-900 w-1/2 mt-2" />
                <div className="h-6 rounded-md bg-slate-200 dark:bg-zinc-900 w-1/4 mt-auto" />
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          /* Empty State */
          <div className="w-full py-20 text-center rounded-3xl bg-white dark:bg-zinc-900/10 border border-slate-200 dark:border-zinc-900 border-dashed">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-2xl">
              📂
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              {searchQuery ? `No articles matching "${searchQuery}"` : "No articles found"}
            </h3>
            <p className="text-slate-500 dark:text-zinc-500 text-sm max-w-sm mx-auto mb-4">
              {searchQuery
                ? "Try searching with a different term."
                : "We couldn't find any published articles yet."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-5 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all"
              >
                Clear Search Filter
              </button>
            )}
          </div>
        ) : (
          /* Grid list of posts */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPosts.map((post) => (
              <div key={post.$id} className="w-full">
                <PostCard {...post} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

export default AllPosts;
