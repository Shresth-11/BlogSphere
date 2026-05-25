import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";
import { Container, PostCard } from "../components";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

// Local Sub-component for Featured Article to ensure separate stateful image fallback
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
    <div className="w-full rounded-3xl overflow-hidden bg-zinc-900/30 border border-zinc-800/80 hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-950/10 transition-all duration-500 backdrop-blur-md">
      <Link to={`/post/${post.$id}`} className="flex flex-col lg:flex-row w-full aspect-auto lg:aspect-[21/9] group">
        {/* Highlight Image Block */}
        <div className="w-full lg:w-1/2 relative overflow-hidden bg-zinc-950 aspect-video lg:aspect-auto">
          <img
            src={imgUrl}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            onError={handleImageError}
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/65 via-zinc-950/10 to-transparent pointer-events-none" />
          <div className="absolute top-4 left-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-violet-300 bg-violet-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-violet-400/20">
              ⭐ Featured Article
            </span>
          </div>
        </div>

        {/* Highlight Info Block */}
        <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-between gap-6 text-left">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-[11px] text-zinc-500 font-bold uppercase tracking-wider">
              <span className="text-violet-400 bg-violet-400/10 px-2.5 py-0.5 rounded-full border border-violet-400/10">Technology</span>
              <span>&bull;</span>
              <span>5 Min Read</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight group-hover:text-violet-400 transition-colors duration-300 line-clamp-3">
              {post.title}
            </h2>
          </div>

          <div className="flex items-center gap-3 border-t border-zinc-900/60 pt-6 mt-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-lg shadow-violet-500/20">
              {post.author ? post.author.charAt(0).toUpperCase() : "W"}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-zinc-300">{post.author || "Anonymous Writer"}</span>
              <span className="text-[10px] text-zinc-500 font-medium">Published Recently</span>
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
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    appwriteService.getPosts([]).then((res) => {
      if (res && res.documents) {
        setPosts(res.documents);
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="w-full relative overflow-hidden pb-20 select-none">
      
      {/* Background Decorative Mesh Glows */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-violet-600/5 blur-[150px] pointer-events-none" />
      <div className="absolute top-48 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[130px] pointer-events-none" />

      <Container>
        
        {/* 1. HERO HEADER SECTION */}
        {!authStatus ? (
          /* High-Impact Glassmorphic Hero Banner for Guests */
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto mt-14 sm:mt-20 mb-20 gap-6 px-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-bold text-violet-300">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
              </span>
              The Ultimate Developer & Creator Space
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-none">
              Write. Connect.<br />
              <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                Inspire the World.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed mt-2 font-medium">
              Share your insights, connect with global builders, and grow your voice. MegaBlog is an ultra-modern publishing playground built with React and Appwrite.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                Get Started Free
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-3.5 text-sm font-bold text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        ) : (
          /* Personalized Creator Workspace welcome for Logged-In Users */
          <div className="relative overflow-hidden mb-16 p-8 sm:p-10 rounded-3xl bg-zinc-900/30 border border-zinc-800/80 backdrop-blur-md shadow-2xl relative z-10">
            <div className="absolute -top-12 -right-12 w-80 h-80 rounded-full bg-violet-600/5 blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="text-left">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/10">
                  Creator Space
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-4 leading-tight">
                  Welcome back, {userData?.name || "Writer"}! 👋
                </h1>
                <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-lg leading-relaxed">
                  What inspiring article are we sharing today? Click below to start crafting your next masterpiece.
                </p>
              </div>
              <div>
                <Link
                  to="/add-post"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-violet-500/10 hover:shadow-violet-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
                >
                  <span>Create New Post</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 2. MAIN POSTS BLOCK */}
        <div className="flex flex-col gap-8 relative z-10">
          
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5">
              <span className="text-violet-500 text-lg">📰</span> Latest Articles
            </h2>
            <Link to="/all-posts" className="text-xs sm:text-sm font-bold text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1.5 group">
              <span>View All Articles</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
            </Link>
          </div>

          {loading ? (
            /* Elegant Skeleton Loading Grid */
            <div className="flex flex-col gap-10">
              <div className="w-full aspect-[21/9] rounded-3xl bg-zinc-900/30 border border-zinc-800/80 p-8 flex flex-col lg:flex-row gap-6 animate-pulse">
                <div className="w-full lg:w-1/2 rounded-2xl bg-zinc-900 aspect-video lg:aspect-auto" />
                <div className="w-full lg:w-1/2 flex flex-col justify-between py-4">
                  <div className="flex flex-col gap-4">
                    <div className="h-4 bg-zinc-900 rounded-md w-1/4" />
                    <div className="h-8 bg-zinc-900 rounded-md w-3/4" />
                    <div className="h-8 bg-zinc-900 rounded-md w-1/2" />
                  </div>
                  <div className="h-10 bg-zinc-900 rounded-md w-1/3 mt-6" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse rounded-2xl bg-zinc-900/40 border border-zinc-800/80 p-4 h-80 flex flex-col justify-between">
                    <div className="w-full aspect-[16/10] rounded-xl bg-zinc-900" />
                    <div className="h-6 rounded-md bg-zinc-900 w-3/4 mt-4" />
                    <div className="h-4 rounded-md bg-zinc-900 w-1/2 mt-2" />
                    <div className="h-6 rounded-md bg-zinc-900 w-1/4 mt-auto" />
                  </div>
                ))}
              </div>
            </div>
          ) : posts.length === 0 ? (
            /* Premium glassmorphic empty state card */
            <div className="w-full py-20 text-center rounded-3xl bg-zinc-900/10 border border-zinc-900 border-dashed backdrop-blur-sm px-6">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800/80 text-2xl shadow-inner shadow-black/40">
                📭
              </div>
              <h3 className="text-lg font-bold text-white mb-1">No articles found</h3>
              <p className="text-zinc-500 text-sm max-w-sm mx-auto mb-6">
                The database is currently empty. Be the pioneer and draft the very first article!
              </p>
              <Link
                to="/add-post"
                className="inline-flex px-6 py-3 text-xs font-bold text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all cursor-pointer hover:scale-[1.02]"
              >
                Add the First Post
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              
              {/* FEATURED ARTICLE HIGHLIGHT */}
              <FeaturedPostCard post={posts[0]} />

              {/* CARD GRID FOR REST OF THE ARTICLES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {posts.map((post) => (
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
