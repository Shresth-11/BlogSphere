import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } =
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

  const submit = async (data) => {
    setLoading(true);
    try {
      if (post) {
        const file = data.image[0]
          ? await appwriteService.uploadFile(data.image[0])
          : null;

        if (file) {
          appwriteService.deleteFile(post.featuredImage);
        }

        const dbPost = await appwriteService.updatePost(post.$id, {
          ...data,
          featuredImage: file ? file.$id : undefined,
        });

        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      } else {
        const file = await appwriteService.uploadFile(data.image[0]);

        if (file) {
          const fileId = file.$id;
          data.featuredImage = fileId;
          const dbPost = await appwriteService.createPost({
            ...data,
            userId: userData.$id,
            author: userData.name,
          });

          if (dbPost) {
            navigate(`/post/${dbPost.$id}`);
          }
        }
      }
    } catch (err) {
      console.error("PostForm error :: submit ::", err);
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
        .replace(/\s/g, "-");

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
    <form onSubmit={handleSubmit(submit)} className="flex flex-col lg:flex-row gap-8 py-6">
      
      {/* Primary Left Form Column (Title, Slug, RTE Editor) */}
      <div className="w-full lg:w-2/3 flex flex-col gap-6">
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm flex flex-col gap-6">
          <Input
            label="Article Title"
            placeholder="Enter a captivating title"
            {...register("title", { required: true })}
          />
          <Input
            label="Slug / URL Path"
            placeholder="slug-url-path"
            {...register("slug", { required: true })}
            onInput={(e) => {
              setValue("slug", slugTransform(e.currentTarget.value), {
                shouldValidate: true,
              });
            }}
          />
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
            <div className="relative group rounded-xl border border-zinc-800 bg-zinc-900/60 p-2 hover:border-zinc-700 transition-all duration-300">
              <input
                type="file"
                className="w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-violet-500/10 file:text-violet-400 hover:file:bg-violet-500/20 file:cursor-pointer cursor-pointer"
                accept="image/png, image/jpg, image/jpeg, image/gif"
                {...register("image", { required: !post })}
              />
            </div>
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
            className="w-full font-bold py-3 mt-2 cursor-pointer shadow-lg shadow-violet-500/20"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing...
              </span>
            ) : post ? (
              "Update Article"
            ) : (
              "Publish Article"
            )}
          </Button>
        </div>

      </div>
    </form>
  );
}
