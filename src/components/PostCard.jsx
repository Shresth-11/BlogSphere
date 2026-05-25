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
      console.warn(`PostCard :: Failed to load raw image stream for "${title}". Using premium Unsplash mockup.`);
      e.target.onerror = null;
      e.target.src = "https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?auto=format&fit=crop&w=1200&q=80";
    }
  };

  return (
    <Link to={`/post/${$id}`} className="group block h-full">
      <div className="flex flex-col h-full rounded-2xl bg-zinc-900/35 border border-zinc-800/80 hover:border-violet-500/30 p-4 transition-all duration-500 hover:shadow-2xl hover:shadow-violet-950/15 group-hover:translate-y-[-4px] backdrop-blur-md overflow-hidden relative">
        {/* Subtle hover neon glow ring inside the card */}
        <div className="absolute inset-0 border border-violet-500/0 group-hover:border-violet-500/10 rounded-2xl pointer-events-none transition-all duration-500" />
        
        {/* Post Image Container */}
        <div className="w-full aspect-[16/10] rounded-xl overflow-hidden mb-4 relative bg-zinc-950 shadow-inner">
          <img
            src={imgUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-750 ease-out group-hover:scale-[1.04]"
            loading="lazy"
            onError={handleImageError}
          />
          {/* Subtle overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/50 via-zinc-950/5 to-transparent pointer-events-none" />
        </div>
        
        {/* Post Metadata Card Details */}
        <div className="flex flex-col flex-grow justify-between gap-3 text-left">
          <div className="flex flex-col gap-2">
            {/* Styled Badge Row */}
            <div className="flex items-center justify-between text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
              <span className="text-violet-400 bg-violet-400/10 px-2.5 py-0.5 rounded-full border border-violet-400/10">
                Article
              </span>
              <span>5 min read</span>
            </div>
            
            <h2 className="text-base sm:text-lg font-extrabold text-white group-hover:text-violet-400 transition-colors duration-300 line-clamp-2 leading-snug">
              {title}
            </h2>
          </div>
          
          {/* Author info */}
          <div className="flex items-center gap-2 border-t border-zinc-900/60 pt-3 mt-1">
            <div className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-[10px] font-bold text-violet-300 shadow-md">
              {author ? author.charAt(0).toUpperCase() : "W"}
            </div>
            <span className="text-xs font-semibold text-zinc-400 group-hover:text-zinc-200 transition-colors duration-300 truncate">
              {author || "Anonymous"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
