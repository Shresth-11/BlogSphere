import React from "react";
import appwriteService from "../appwrite/config";
import { Link } from "react-router-dom";

function PostCard({ $id, title, featuredImage, author }) {
  const [imgUrl, setImgUrl] = React.useState(appwriteService.getFilePreview(featuredImage));

  const handleImageError = (e) => {
    const rawUrl = appwriteService.getFileViewUrl(featuredImage);
    if (imgUrl !== rawUrl) {
      console.log(`PostCard :: Preview failed for "${title}". Falling back to raw file stream:`, rawUrl);
      setImgUrl(rawUrl);
    } else {
      console.warn(`PostCard :: Failed to load raw image stream for "${title}". Using fallback.`);
      e.target.onerror = null;
      e.target.src = "https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?auto=format&fit=crop&w=1200&q=80";
    }
  };

  return (
    <Link to={`/post/${$id}`} className="group block h-full select-none">
      <div className="flex flex-col h-full rounded-2xl bg-white dark:bg-zinc-900/35 border border-slate-200/90 dark:border-zinc-800/80 hover:border-indigo-400/50 dark:hover:border-violet-500/30 p-4 transition-all duration-300 shadow-sm shadow-slate-200/60 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-violet-950/15 group-hover:-translate-y-1 backdrop-blur-md overflow-hidden relative">
        {/* Hover ring overlay */}
        <div className="absolute inset-0 border border-indigo-500/0 group-hover:border-indigo-500/10 dark:group-hover:border-violet-500/10 rounded-2xl pointer-events-none transition-all duration-300" />
        
        {/* Post Image Container */}
        <div className="w-full aspect-[16/10] rounded-xl overflow-hidden mb-4 relative bg-slate-100 dark:bg-zinc-950 shadow-inner">
          <img
            src={imgUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            loading="lazy"
            onError={handleImageError}
          />
          {/* Visual gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 dark:from-zinc-950/50 via-transparent to-transparent pointer-events-none" />
        </div>
        
        {/* Post Details */}
        <div className="flex flex-col flex-grow justify-between gap-3 text-left">
          <div className="flex flex-col gap-2">
            {/* Category / Read time */}
            <div className="flex items-center justify-between text-[11px] font-bold tracking-wider uppercase">
              <span className="text-indigo-600 bg-indigo-50 border border-indigo-200/60 dark:text-violet-400 dark:bg-violet-400/10 dark:border-violet-400/10 px-2.5 py-0.5 rounded-full">
                Article
              </span>
              <span className="text-slate-400 dark:text-zinc-500">5 min read</span>
            </div>
            
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-violet-400 transition-colors duration-300 line-clamp-2 leading-snug">
              {title}
            </h2>
          </div>
          
          {/* Author info */}
          <div className="flex items-center gap-2 border-t border-slate-100 dark:border-zinc-900/60 pt-3 mt-1">
            <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-violet-500/20 border border-indigo-200 dark:border-violet-500/30 flex items-center justify-center text-[10px] font-bold text-indigo-700 dark:text-violet-300 shadow-sm">
              {author ? author.charAt(0).toUpperCase() : "W"}
            </div>
            <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400 group-hover:text-slate-900 dark:group-hover:text-zinc-200 transition-colors duration-300 truncate">
              {author || "Anonymous"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
