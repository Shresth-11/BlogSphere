import React, { useState, useEffect } from "react";
import appwriteService from "../appwrite/config";
import { Container, PostCard } from "../components";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appwriteService.getPosts([]).then((posts) => {
      if (posts) {
        setPosts(posts.documents);
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="w-full py-12">
      <Container>
        {/* Top Header Section */}
        <div className="flex flex-col gap-2 mb-10 border-b border-zinc-900 pb-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">
            Explore Content
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            Discover Inspiring Articles
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl">
            Browse our community articles written by innovators, storytellers, and designers.
          </p>
        </div>

        {loading ? (
          /* Premium Loading Grid State */
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
        ) : posts.length === 0 ? (
          <div className="w-full py-20 text-center rounded-2xl bg-zinc-900/10 border border-zinc-900 border-dashed">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-zinc-900 text-2xl">
              📂
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No articles found</h3>
            <p className="text-zinc-500 text-sm max-w-sm mx-auto">
              We couldn't find any published articles. Login and add one yourself!
            </p>
          </div>
        ) : (
          /* Grid list of posts */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {posts.map((post) => (
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
