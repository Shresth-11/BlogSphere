import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);

  const isAuthor = post && userData ? post.userId === userData.$id : false;

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((post) => {
        if (post) setPost(post);
        else navigate("/");
      });
    } else navigate("/");
  }, [slug, navigate]);

  const deletePost = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      appwriteService.deletePost(post.$id).then((status) => {
        if (status) {
          appwriteService.deleteFile(post.featuredImage);
          navigate("/");
        }
      });
    }
  };

  return post ? (
    <div className="py-12">
      <Container>
        <article className="max-w-4xl mx-auto flex flex-col gap-8">
          
          {/* Back to feed navigation */}
          <div>
            <Link to="/all-posts" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-white transition-colors">
              &larr; Back to articles
            </Link>
          </div>

          {/* Hero Featured Image Banner */}
          <div className="w-full relative aspect-[16/9] rounded-3xl overflow-hidden border border-zinc-900 shadow-2xl">
            <img
              src={appwriteService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            {/* Visual gradient vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

            {/* Author Controls Overlay for Post Creator */}
            {isAuthor && (
              <div className="absolute right-6 top-6 flex items-center gap-3">
                <Link to={`/edit-post/${post.$id}`}>
                  <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-zinc-900/90 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 rounded-xl backdrop-blur-md shadow-lg transition-all duration-300 cursor-pointer">
                    <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span>Edit</span>
                  </button>
                </Link>
                <button
                  onClick={deletePost}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-rose-950/80 border border-rose-900/80 hover:bg-rose-900 hover:border-rose-700 rounded-xl backdrop-blur-md shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>

          {/* Article Header Details */}
          <div className="flex flex-col gap-4 border-b border-zinc-900 pb-8">
            {/* Category / Read time indicators */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
                Technology
              </span>
              <span className="text-zinc-600">&bull;</span>
              <span className="text-xs text-zinc-500 font-semibold tracking-wider uppercase">
                5 Min Read
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {post.title}
            </h1>

            {/* Author Badge and metadata */}
            <div className="flex items-center gap-3 mt-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white text-base shadow-lg shadow-violet-500/20">
                {post.author ? post.author.charAt(0).toUpperCase() : "W"}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-zinc-200">
                  {post.author || "Anonymous Writer"}
                </span>
                <span className="text-xs text-zinc-500 font-medium">
                  Published on {post.$createdAt ? new Date(post.$createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "Recently"}
                </span>
              </div>
            </div>
          </div>

          {/* Article Body Content */}
          <div className="browser-css leading-relaxed zinc-rich-text">
            {parse(post.content)}
          </div>

        </article>
      </Container>
    </div>
  ) : null;
}
