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
    <div className="w-full rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300">
      <Link to={`/post/${post.$id}`} className="flex flex-col lg:flex-row w-full aspect-auto lg:aspect-[21/9] group">
        {/* Featured Image */}
        <div className="w-full lg:w-1/2 relative overflow-hidden bg-slate-100 dark:bg-zinc-950 aspect-video lg:aspect-auto">
          <img
            src={imgUrl}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            onError={handleImageError}
            loading="eager"
          />
          <div className="absolute top-4 left-4">
            <span className="text-[11px] font-semibold text-slate-700 dark:text-zinc-300 bg-white/90 dark:bg-zinc-900/90 px-3 py-1 rounded-md border border-slate-200 dark:border-zinc-800 shadow-xs">
              Featured
            </span>
          </div>
        </div>

        {/* Featured Content Info */}
        <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-between gap-6 text-left bg-white dark:bg-zinc-900">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
              <span className="font-medium text-slate-700 dark:text-zinc-300">
                Technology
              </span>
              <span>&bull;</span>
              <span>5 min read</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-violet-400 transition-colors duration-200 line-clamp-3">
              {post.title}
            </h2>
          </div>

          <div className="flex items-center gap-3 border-t border-slate-100 dark:border-zinc-800 pt-5 mt-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-slate-700 dark:text-zinc-300 text-xs">
              {post.author ? post.author.charAt(0).toUpperCase() : "W"}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-900 dark:text-zinc-200">
                {post.author || "Anonymous"}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                Recently published
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

  const categories = ["All", "Technology", "Design", "Engineering", "Writing"];

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
    <div className="w-full relative overflow-hidden pb-20 select-none bg-slate-50 dark:bg-zinc-950 min-h-screen">
      <Container>
        {/* HERO HEADER SECTION */}
        {!authStatus ? (
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto py-12 sm:py-20 gap-5 px-4 relative z-10">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Stories, insights, and ideas for curious minds.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 max-w-xl leading-relaxed font-normal">
              A space for writers and builders to share what they&apos;re learning, building, and thinking about.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3 mt-3">
              <button
                onClick={() => navigate("/signup")}
                className="px-6 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-xl transition-all duration-200 cursor-pointer shadow-xs"
              >
                Start Writing
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-200/70 dark:hover:bg-zinc-800 border border-slate-300 dark:border-zinc-800 rounded-xl transition-all duration-200 cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden my-8 p-8 sm:p-10 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs z-10">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                  Welcome back, {userData?.name || "Writer"}
                </h1>
                <p className="text-slate-600 dark:text-zinc-400 text-sm mt-1 max-w-md">
                  Have something to share today? Start a new post anytime.
                </p>
              </div>
              <div>
                <Link
                  to="/add-post"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 rounded-xl transition-all duration-200 cursor-pointer"
                >
                  <span>New Post</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* SEARCH & FILTER BAR */}
        <div className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-3 sm:p-4 shadow-xs mb-10 z-10 relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-9 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 text-sm font-medium focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
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

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold"
                    : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ARTICLES GRID */}
        <div className="flex flex-col gap-8 relative z-10">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-4 text-left">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Recent Articles
            </h2>
            <Link
              to="/all-posts"
              className="text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              View all &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col gap-8">
              <div className="w-full aspect-[21/9] rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-8 flex flex-col lg:flex-row gap-6 animate-pulse">
                <div className="w-full lg:w-1/2 rounded-xl bg-slate-100 dark:bg-zinc-800 aspect-video lg:aspect-auto" />
                <div className="w-full lg:w-1/2 flex flex-col justify-between py-4">
                  <div className="flex flex-col gap-4">
                    <div className="h-4 bg-slate-100 dark:bg-zinc-800 rounded-md w-1/4" />
                    <div className="h-8 bg-slate-100 dark:bg-zinc-800 rounded-md w-3/4" />
                  </div>
                  <div className="h-10 bg-slate-100 dark:bg-zinc-800 rounded-md w-1/3 mt-6" />
                </div>
              </div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="w-full py-16 text-center rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 px-6">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                {searchQuery ? `No articles matching "${searchQuery}"` : "No articles published yet"}
              </h3>
              <p className="text-slate-500 dark:text-zinc-400 text-xs max-w-xs mx-auto mb-4">
                {searchQuery
                  ? "Try searching for another topic."
                  : "Write the first article to get started."}
              </p>
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  Clear search
                </button>
              ) : (
                <Link
                  to="/add-post"
                  className="inline-flex px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg"
                >
                  New Post
                </Link>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {!searchQuery && <FeaturedPostCard post={filteredPosts[0]} />}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
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
