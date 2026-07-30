import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
  const [post, setPost] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { slug } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  // Flexible author check (matches Appwrite $id, uid, id, or author name)
  const isAuthor = Boolean(
    post &&
    userData &&
    (post.userId === userData.$id ||
     post.userId === userData.id ||
     post.userId === userData.uid ||
     post.userId === userData.userId ||
     (post.author && userData.name && post.author.trim().toLowerCase() === userData.name.trim().toLowerCase()))
  );

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((post) => {
        if (post) {
          setPost(post);
          setImgUrl(appwriteService.getFilePreview(post.featuredImage));
        } else navigate("/");
      });
    } else navigate("/");
  }, [slug, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(currentProgress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleImageError = (e) => {
    if (post) {
      const rawUrl = appwriteService.getFileViewUrl(post.featuredImage);
      if (imgUrl !== rawUrl) {
        console.log(`Post details :: Preview failed. Falling back to raw file stream:`, rawUrl);
        setImgUrl(rawUrl);
      } else {
        e.target.onerror = null;
        e.target.src = "https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?auto=format&fit=crop&w=1200&q=80";
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const deletePost = () => {
    if (window.confirm("Are you sure you want to delete this article? This action cannot be undone.")) {
      appwriteService.deletePost(post.$id).then((status) => {
        if (status) {
          appwriteService.deleteFile(post.featuredImage);
          navigate("/");
        }
      });
    }
  };

  return post ? (
    <div className="py-10 select-none relative">
      {/* Scroll Progress Bar at Top */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-200 dark:bg-zinc-800 z-50">
        <div
          className="h-full bg-indigo-600 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <Container>
        <article className="max-w-4xl mx-auto flex flex-col gap-8">
          {/* Top Action Navigation Bar */}
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/all-posts"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              &larr; Back to articles
            </Link>

            <div className="flex items-center gap-3">
              {/* Author Edit & Delete Action Buttons */}
              {isAuthor && (
                <>
                  <Link to={`/edit-post/${post.$id}`}>
                    <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all cursor-pointer">
                      <svg className="w-3.5 h-3.5 text-indigo-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <span>Edit Post</span>
                    </button>
                  </Link>

                  <button
                    onClick={deletePost}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-all cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Delete Post</span>
                  </button>
                </>
              )}

              {/* Share Article Button */}
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <span className="text-emerald-600">✓</span>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5 text-indigo-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Featured Image */}
          <div className="w-full relative aspect-[16/9] rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 shadow-sm bg-slate-100 dark:bg-zinc-950">
            <img
              src={imgUrl}
              alt={post.title}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          </div>

          {/* Article Header Details */}
          <div className="flex flex-col gap-4 border-b border-slate-200 dark:border-zinc-800 pb-8 text-left">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200 dark:text-violet-400 dark:bg-violet-500/10 dark:border-violet-500/20 px-3 py-1 rounded-full">
                Technology
              </span>
              <span className="text-slate-400 dark:text-zinc-600">&bull;</span>
              <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                5 min read
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
              {post.title}
            </h1>

            {/* Author Info Bar with Direct Edit/Delete Buttons */}
            <div className="flex items-center justify-between gap-4 mt-2 pt-2 border-t border-slate-100 dark:border-zinc-800/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-slate-700 dark:text-zinc-200 text-sm">
                  {post.author ? post.author.charAt(0).toUpperCase() : "W"}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900 dark:text-zinc-200">
                    {post.author || "Anonymous"}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-zinc-400">
                    Published on{" "}
                    {post.$createdAt
                      ? new Date(post.$createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Recently"}
                  </span>
                </div>
              </div>

              {/* Duplicate Edit/Delete Buttons for Author */}
              {isAuthor && (
                <div className="flex items-center gap-2">
                  <Link to={`/edit-post/${post.$id}`}>
                    <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 transition-colors">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={deletePost}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/80 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Article Body Content */}
          <div className="browser-css text-left leading-relaxed">
            {parse(post.content)}
          </div>
        </article>
      </Container>
    </div>
  ) : null;
}
