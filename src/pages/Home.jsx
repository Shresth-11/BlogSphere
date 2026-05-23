import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";
import { Container, PostCard } from "../components";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  useEffect(() => {
    // Only attempt to fetch posts if the user is authenticated (or we just want to fetch public posts)
    appwriteService.getPosts().then((posts) => {
      if (posts) {
        setPosts(posts.documents);
      }
    });
  }, []);

  // 1. Guest / Unauthenticated Landing Page with High-Impact Hero Banner
  if (!authStatus) {
    return (
      <div className="w-full relative overflow-hidden pt-10 pb-20">
        {/* Background Mesh Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />

        <Container>
          {/* Hero Content Section */}
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto mt-12 md:mt-20 gap-6 px-4">
            
            {/* Elegant Floating Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-semibold text-violet-300 animate-pulse">
              <span>✨</span> The Future of Blogging is Here
            </div>

            {/* Headline with Neon Gradients */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-none">
              Write. Connect.<br />
              <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                Inspire the World.
              </span>
            </h1>

            {/* Compelling Tagline */}
            <p className="text-base sm:text-xl text-zinc-400 max-w-2xl leading-relaxed mt-2">
              Share your thoughts, connect with global minds, and build your digital footprint. MegaBlog is the modern serverless platform designed for developers, storytellers, and creatives.
            </p>

            {/* Direct Call to Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-violet-500/20 hover:shadow-violet-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                Start Writing - It's Free
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-3.5 text-base font-semibold text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Core Feature Cards Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-24 px-4">
            
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 hover:border-zinc-700/60 backdrop-blur-sm transition-all duration-300">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 mb-6 font-bold text-xl">
                ⚡
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Lightning Performance</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Powered by React, Vite, and serverless Appwrite DB. Pages load instantly with minimal latency.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 hover:border-zinc-700/60 backdrop-blur-sm transition-all duration-300">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-6 font-bold text-xl">
                📝
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Rich Editor Support</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Draft beautiful, expressive articles using a powerful, full-featured TinyMCE rich text editor.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 hover:border-zinc-700/60 backdrop-blur-sm transition-all duration-300">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-6 font-bold text-xl">
                🎨
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Modern Slate Aesthetics</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                A gorgeous dark UI meticulously crafted to offer readers a cozy, readable, and stunning visual experience.
              </p>
            </div>

          </div>
        </Container>
      </div>
    );
  }

  // 2. Authenticated Dashboard Landing
  return (
    <div className="w-full py-12">
      <Container>
        {/* Welcome Dashboard Banner */}
        <div className="relative overflow-hidden mb-12 p-8 sm:p-10 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-sm">
          <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">
                Dashboard Overview
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-1 leading-tight">
                Welcome back, {userData?.name || "Writer"}! 👋
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-lg">
                What inspiring article are we sharing today? Click below to start crafting your next masterpiece.
              </p>
            </div>
            <div>
              <Link
                to="/add-post"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-violet-500/10 hover:shadow-violet-500/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              >
                <span>Create New Post</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Dynamic Post Feed */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span>📰</span> Latest Articles
            </h2>
            <Link to="/all-posts" className="text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors">
              View All Posts &rarr;
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="w-full py-16 text-center rounded-2xl bg-zinc-900/10 border border-zinc-900 border-dashed">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-zinc-900 text-2xl">
                📭
              </div>
              <h3 className="text-lg font-bold text-white mb-1">No articles found</h3>
              <p className="text-zinc-500 text-sm max-w-sm mx-auto mb-6">
                The database is currently empty. Be the pioneer and draft the very first article!
              </p>
              <Link
                to="/add-post"
                className="px-5 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all"
              >
                Add the First Post
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {posts.map((post) => (
                <div key={post.$id} className="w-full">
                  <PostCard {...post} />
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

export default Home;
