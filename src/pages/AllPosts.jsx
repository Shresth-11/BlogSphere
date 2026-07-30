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
    <div className="w-full py-10 select-none">
      <Container>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-slate-200 dark:border-zinc-800 pb-6 w-full text-left">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">
              All Articles
            </h1>
            <p className="text-slate-600 dark:text-zinc-400 text-sm font-normal">
              Explore the latest stories, guides, and thoughts published by our community.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-9 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 text-sm font-medium focus:outline-none focus:border-slate-400 shadow-xs transition-all"
            />
            <svg
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:text-zinc-500"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {loading ? (
          /* Loading State */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-4 h-80 flex flex-col justify-between"
              >
                <div className="w-full aspect-[16/10] rounded-xl bg-slate-100 dark:bg-zinc-800" />
                <div className="h-6 rounded-md bg-slate-100 dark:bg-zinc-800 w-3/4 mt-4" />
                <div className="h-4 rounded-md bg-slate-100 dark:bg-zinc-800 w-1/2 mt-2" />
                <div className="h-6 rounded-md bg-slate-100 dark:bg-zinc-800 w-1/4 mt-auto" />
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          /* Empty State */
          <div className="w-full py-16 text-center rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
              {searchQuery ? `No articles matching "${searchQuery}"` : "No articles found"}
            </h3>
            <p className="text-slate-500 dark:text-zinc-400 text-xs max-w-xs mx-auto mb-4">
              {searchQuery
                ? "Try searching for a different term."
                : "No published articles found yet."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          /* Grid list of posts */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
