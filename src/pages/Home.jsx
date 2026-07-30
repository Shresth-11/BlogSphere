import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";
import { Container, PostCard } from "../components";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

function FeaturedPostCard({ post }) {
  const [imgUrl, setImgUrl] = useState(appwriteService.getFilePreview(post.featuredImage));

  const handleImageError = (e) => {
    const rawUrl = appwriteService.getFileViewUrl(post.featuredImage);
    if (imgUrl !== rawUrl) {
      console.log(`Home :: Featured Article preview failed for "${post.title}". Falling back to raw file stream:`, rawUrl);
      setImgUrl(rawUrl);
    } else {
      console.warn(`Home :: Failed to load raw image stream for featured article "${post.title}". Using fallback.`);
      e.target.onerror = null;
      e.target.src = "https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?auto=format&fit=crop&w=1200&q=80";
    }
  };

  return (
    <div className="w-full rounded-3xl overflow-hidden bg-white dark:bg-zinc-900/30 border border-slate-200/90 dark:border-zinc-800/80 hover:border-indigo-400/50 dark:hover:border-violet-500/30 shadow-md shadow-slate-200/60 dark:shadow-none hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-violet-950/10 transition-all duration-500 backdrop-blur-md">
      <Link to={`/post/${post.$id}`} className="flex flex-col lg:flex-row w-full aspect-auto lg:aspect-[21/9] group">
        {/* Featured Image */}
        <div className="w-full lg:w-1/2 relative overflow-hidden bg-slate-100 dark:bg-zinc-950 aspect-video lg:aspect-auto">
          <img
            src={imgUrl}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            onError={handleImageError}
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 dark:from-zinc-950/65 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-4 left-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-700 dark:text-violet-300 bg-white/95 dark:bg-violet-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-indigo-200 dark:border-violet-400/20 shadow-sm">
              ⭐ Featured Article
            </span>
          </div>
        </div>

        {/* Featured Content Info */}
        <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-between gap-6 text-left">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
              <span className="text-indigo-600 bg-indigo-50 dark:text-violet-400 dark:bg-violet-400/10 px-2.5 py-0.5 rounded-full border border-indigo-200/60 dark:border-violet-400/10">
                Technology
              </span>
              <span>&bull;</span>
              <span>5 Min Read</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-violet-400 transition-colors duration-300 line-clamp-3">
              {post.title}
            </h2>
          </div>

          <div className="flex items-center gap-3 border-t border-slate-100 dark:border-zinc-900/60 pt-6 mt-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center font-bold text-white text-xs shadow-md shadow-indigo-500/20">
              {post.author ? post.author.charAt(0).toUpperCase() : "W"}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800 dark:text-zinc-300">
                {post.author || "Anonymous Writer"}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
                Published Recently
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  const categories = ["All", "Technology", "Design", "AI & Code", "Tutorials"];

  useEffect(() => {
    setLoading(true);
    appwriteService.getPosts([]).then((res) => {
      if (res && res.documents) {
        setPosts(res.documents);
      }
      setLoading(false);
    });
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.author && post.author.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="w-full relative overflow-hidden pb-20 select-none">
      {/* Soft Background Mesh Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-[140px] pointer-events-none" />

      <Container>
        {/* HERO HEADER SECTION */}
        {!authStatus ? (
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto mt-10 sm:mt-16 mb-16 gap-6 px-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm text-xs font-bold text-indigo-600 dark:text-violet-300">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              ✨ The Next-Gen Publishing Platform
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Write. Connect.<br />
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
                Inspire the World.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 max-w-2xl leading-relaxed mt-1 font-medium">
              Discover stories, technical guides, and design insights from global builders. BlogSphere is a modern, light-first publishing engine built with React & Appwrite.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-3">
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                Start Writing Free
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-3.5 text-sm font-bold text-slate-700 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 hover:border-slate-400 dark:hover:border-zinc-700 rounded-xl hover:scale-[1.02] active:scale-[0.98] shadow-sm transition-all duration-300 cursor-pointer"
              >
                Sign In
              </button>
            </div>

            {/* Quick Hero Highlights Bar */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-6 pt-6 border-t border-slate-200/80 dark:border-zinc-800/80 text-xs font-semibold text-slate-500 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="text-indigo-600 dark:text-violet-400 font-extrabold text-sm">⚡</span>
                <span>Fast Appwrite Backend</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-indigo-600 dark:text-violet-400 font-extrabold text-sm">📝</span>
                <span>Rich Text Editor</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-indigo-600 dark:text-violet-400 font-extrabold text-sm">🎨</span>
                <span>Editorial Light UI</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden mb-12 p-8 sm:p-10 rounded-3xl bg-white dark:bg-zinc-900/30 border border-slate-200/90 dark:border-zinc-800/80 shadow-sm shadow-slate-200/50 dark:shadow-2xl z-10">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="text-left">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-violet-400 bg-indigo-50 dark:bg-violet-500/10 px-3 py-1 rounded-full border border-indigo-200/60 dark:border-violet-500/10">
                  Creator Hub
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-4 leading-tight">
                  Welcome back, {userData?.name || "Writer"}! 👋
                </h1>
                <p className="text-slate-600 dark:text-zinc-400 text-sm sm:text-base mt-2 max-w-lg leading-relaxed font-medium">
                  Ready to publish your next piece? Draft your article and share it instantly with the community.
                </p>
              </div>
              <div>
                <Link
                  to="/add-post"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
                >
                  <span>Create New Post</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* UNIFIED SEARCH & FILTER TOOLBAR CARD */}
        <div className="w-full bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-4 shadow-sm shadow-slate-200/50 mb-10 z-10 relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 text-sm font-medium focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 transition-all"
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

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                    : "bg-slate-100 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN ARTICLES GRID */}
        <div className="flex flex-col gap-8 relative z-10">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-900 pb-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <span className="text-indigo-600 dark:text-violet-400 text-lg">📰</span> Latest Articles
              {searchQuery && (
                <span className="text-xs font-normal text-slate-500 dark:text-zinc-400 ml-2">
                  (Found {filteredPosts.length} results)
                </span>
              )}
            </h2>
            <Link
              to="/all-posts"
              className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-violet-400 hover:text-indigo-700 dark:hover:text-violet-300 transition-colors flex items-center gap-1.5 group"
            >
              <span>Explore All</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
            </Link>
          </div>

          {loading ? (
            /* Skeleton Loading Grid */
            <div className="flex flex-col gap-10">
              <div className="w-full aspect-[21/9] rounded-3xl bg-slate-200/60 dark:bg-zinc-900/30 border border-slate-200 dark:border-zinc-800/80 p-8 flex flex-col lg:flex-row gap-6 animate-pulse">
                <div className="w-full lg:w-1/2 rounded-2xl bg-slate-300/60 dark:bg-zinc-900 aspect-video lg:aspect-auto" />
                <div className="w-full lg:w-1/2 flex flex-col justify-between py-4">
                  <div className="flex flex-col gap-4">
                    <div className="h-4 bg-slate-300/60 dark:bg-zinc-900 rounded-md w-1/4" />
                    <div className="h-8 bg-slate-300/60 dark:bg-zinc-900 rounded-md w-3/4" />
                  </div>
                  <div className="h-10 bg-slate-300/60 dark:bg-zinc-900 rounded-md w-1/3 mt-6" />
                </div>
              </div>
            </div>
          ) : filteredPosts.length === 0 ? (
            /* Empty State */
            <div className="w-full py-20 text-center rounded-3xl bg-white dark:bg-zinc-900/10 border border-slate-200 dark:border-zinc-900 border-dashed shadow-sm px-6">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-2xl">
                📭
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                {searchQuery ? `No articles matching "${searchQuery}"` : "No articles found"}
              </h3>
              <p className="text-slate-500 dark:text-zinc-500 text-sm max-w-sm mx-auto mb-6">
                {searchQuery
                  ? "Try searching for a different title or clear the filter."
                  : "Be the pioneer and draft the very first article!"}
              </p>
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-6 py-2.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all"
                >
                  Clear Search Filter
                </button>
              ) : (
                <Link
                  to="/add-post"
                  className="inline-flex px-6 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all"
                >
                  Add the First Post
                </Link>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              {/* FEATURED HIGHLIGHT */}
              {!searchQuery && <FeaturedPostCard post={filteredPosts[0]} />}

              {/* ARTICLE CARDS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredPosts.map((post) => (
                  <div key={post.$id} className="w-full">
                    <PostCard {...post} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

export default Home;
