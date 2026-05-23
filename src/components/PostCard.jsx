import React from "react";
import appwriteService from "../appwrite/config";
import { Link } from "react-router-dom";

function PostCard({ $id, title, featuredImage, author }) {
  return (
    <Link to={`/post/${$id}`} className="group block h-full">
      <div className="flex flex-col h-full rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700/60 p-4 transition-all duration-300 hover:shadow-xl hover:shadow-violet-950/10 group-hover:translate-y-[-4px] backdrop-blur-sm overflow-hidden">
        
        {/* Post Image Container */}
        <div className="w-full aspect-[16/10] rounded-xl overflow-hidden mb-4 relative bg-zinc-950">
          <img
            src={appwriteService.getFilePreview(featuredImage)}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* Subtle overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>
        
        {/* Post Metadata Card Details */}
        <div className="flex flex-col flex-grow justify-between gap-3">
          <div className="flex flex-col gap-2">
            {/* Styled Badge Row */}
            <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
              <span className="text-violet-400 bg-violet-400/10 px-2.5 py-0.5 rounded-full border border-violet-400/10">
                Article
              </span>
              <span>5 min read</span>
            </div>
            
            <h2 className="text-base sm:text-lg font-bold text-white group-hover:text-violet-400 transition-colors line-clamp-2 leading-snug">
              {title}
            </h2>
          </div>
          
          {/* Mock Author info */}
          <div className="flex items-center gap-2 border-t border-zinc-900 pt-3">
            <div className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-[10px] font-bold text-violet-300">
              {author ? author.charAt(0).toUpperCase() : "W"}
            </div>
            <span className="text-xs text-zinc-400 truncate">
              {author || "Anonymous"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
