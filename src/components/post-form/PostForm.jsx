import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
  const [error, setError] = useState("");
  const { register, handleSubmit, watch, setValue, control, getValues, formState: { errors } } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.$id || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const userData = useSelector((state) => state.auth.userData);

  const toFriendlyUserError = (err) => {
    const msg = err?.message || "";
    
    if (msg.includes("Missing required attribute") || msg.includes("required attribute") || msg.includes("structure")) {
      return "Some required information is missing or configured incorrectly in the database. Please ensure the Title, Content, and Status are filled out and try again.";
    }
    if (msg.includes("Unknown attribute") || msg.includes("Attribute not found")) {
      return "We encountered a database column mapping mismatch. Our system is auto-adapting; please click Publish again in a second.";
    }
    if (msg.includes("Rate limit") || msg.includes("rate_limit") || msg.includes("Too Many Requests")) {
      return "You're publishing articles extremely fast! Appwrite has placed a temporary rate limit. Please wait 10 seconds and click Publish again.";
    }
    if (msg.includes("unauthorized") || msg.includes("401") || msg.includes("User is not authorized")) {
      return "Your login session has expired. Please log out, sign in again, and your article will be published successfully.";
    }
    if (msg.includes("Network Error") || msg.includes("Failed to fetch") || msg.includes("NetworkRequestError")) {
      return "Unable to connect to the server. Please check your internet connection and try publishing again.";
    }
    if (msg.includes("file permissions") || msg.includes("Storage") || msg.includes("upload")) {
      return "Unable to upload your featured image. Please ensure your image is under 5MB and is a valid JPG/PNG/GIF file.";
    }
    
    return msg || "We were unable to publish your article due to a temporary database communication issue. Please review your details and try again.";
  };

  const submit = async (data) => {
    setLoading(true);
    setError("");
    try {
      if (post) {
        if (data.image[0]) {
          await appwriteService.deleteFile(post.featuredImage || post.$id);
        }

        const file = data.image[0]
          ? await appwriteService.uploadFile(data.image[0], post.$id)
          : null;

        if (data.image[0] && !file) {
          throw new Error("Failed to upload the new featured image to Appwrite Storage. Please check file permissions.");
        }

        const dbPost = await appwriteService.updatePost(post.$id, {
          ...data,
          featuredImage: file ? file.$id : undefined,
        });

        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      } else {
        const slug = data.slug || getValues("slug") || slugTransform(data.title);
        const file = await appwriteService.uploadFile(data.image[0], slug);

        if (file) {
          const fileId = file.$id;
          data.featuredImage = fileId;
          console.log("PostForm :: submit :: Submitting with userData:", userData);
          const dbPost = await appwriteService.createPost({
            ...data,
            slug,
            userId: userData ? (userData.$id || userData.uid || userData.id || userData.userId) : undefined,
            author: userData ? (userData.name || userData.username || userData.email) : undefined,
          });

          if (dbPost) {
            navigate(`/post/${dbPost.$id}`);
          }
        } else {
          throw new Error("Failed to upload the featured image to Appwrite Storage. Please check file permissions or size.");
        }
      }
    } catch (err) {
      console.error("PostForm error :: submit ::", err);
      setError(toFriendlyUserError(err));
    } finally {
      setLoading(false);
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-")
        .slice(0, 36) // Appwrite document ID limit is 36 characters
        .replace(/-+$/, ""); // Trim trailing hyphens

    return "";
  }, []);

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-6 py-6 w-full">
      
      {/* Dynamic Error Notification Banner */}
      {error && (
        <div className="w-full p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm font-semibold flex flex-col gap-2 backdrop-blur-md text-left shadow-lg shadow-rose-950/20">
          <div className="flex items-start gap-3">
            <span className="text-lg leading-none mt-0.5">⚠️</span>
            <div className="flex flex-col gap-1">
              <span className="text-white font-bold">Failed to publish article</span>
              <span className="text-xs text-rose-300/80 leading-normal">{error}</span>
            </div>
          </div>
          <div className="text-[10px] text-rose-400/80 border-t border-rose-500/25 pt-2 pl-8 flex flex-col gap-1">
            <span className="font-bold uppercase tracking-wider text-rose-300">🔍 Diagnostics:</span>
            <span>• Redux User State: {userData ? JSON.stringify(userData) : "null / undefined"}</span>
            <span>• Resolved userId: {userData ? (userData.$id || userData.uid || userData.id || userData.userId || "NOT RESOLVED") : "NO USERDATA"}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 w-full">
        {/* Primary Left Form Column (Title, Slug, RTE Editor) */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Input
                label="Article Title"
                placeholder="Enter a captivating title"
                className={errors.title ? "border-rose-500/80 focus:ring-rose-500/10 bg-rose-950/5" : ""}
                {...register("title", { required: "Article Title is required" })}
              />
              {errors.title && (
                <span className="text-[11px] font-semibold text-rose-400 pl-1 block text-left">
                  ⚠️ {errors.title.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Input
                label="Slug / URL Path"
                placeholder="slug-url-path"
                className={errors.slug ? "border-rose-500/80 focus:ring-rose-500/10 bg-rose-950/5" : ""}
                {...register("slug", { 
                  required: "Slug/URL Path is required", 
                  maxLength: { value: 36, message: "URL Slug must be at most 36 characters long" } 
                })}
                onInput={(e) => {
                  setValue("slug", slugTransform(e.currentTarget.value), {
                    shouldValidate: true,
                  });
                }}
              />
              {errors.slug && (
                <span className="text-[11px] font-semibold text-rose-400 pl-1 block text-left">
                  ⚠️ {errors.slug.message}
                </span>
              )}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm">
            <RTE
              label="Article Content"
              name="content"
              control={control}
              defaultValue={getValues("content")}
            />
          </div>
        </div>

        {/* Sidebar Right Column (Featured Image, Status, Action Button) */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          
          {/* Settings Glass Panel */}
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm flex flex-col gap-6">
            
            <div className="flex flex-col gap-1.5 text-left">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 pl-1">
                Featured Image
              </span>
              <div className={`relative group rounded-xl border bg-zinc-900/60 p-2 transition-all duration-300 ${errors.image ? "border-rose-500/80 hover:border-rose-600" : "border-zinc-800 hover:border-zinc-700"}`}>
                <input
                  type="file"
                  className="w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-violet-500/10 file:text-violet-400 hover:file:bg-violet-500/20 file:cursor-pointer cursor-pointer"
                  accept="image/png, image/jpg, image/jpeg, image/gif"
                  {...register("image", { required: !post ? "Featured Image is required" : false })}
                />
              </div>
              {errors.image && (
                <span className="text-[11px] font-semibold text-rose-400 pl-1 block">
                  ⚠️ {errors.image.message}
                </span>
              )}
            </div>

            {post && (
              <div className="w-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 p-2 shadow-inner">
                <img
                  src={appwriteService.getFilePreview(post.featuredImage)}
                  alt={post.title}
                  className="w-full rounded-xl object-cover aspect-video"
                />
                <span className="block text-center text-[10px] text-zinc-500 font-medium mt-2">
                  Current Featured Image
                </span>
              </div>
            )}

            <Select
              options={["active", "inactive"]}
              label="Publication Status"
              {...register("status", { required: true })}
            />

            <Button
              type="submit"
              bgColor={post ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/10 hover:shadow-emerald-500/20" : undefined}
              className="w-full font-bold py-3 mt-2 cursor-pointer shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.98] transition-all"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Publishing...</span>
                </>
              ) : post ? (
                "Update Article"
              ) : (
                "Publish Article"
              )}
            </Button>
          </div>

        </div>
      </div>
    </form>
  );
}
