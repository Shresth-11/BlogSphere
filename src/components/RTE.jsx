import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";

export default function RTE({ name, control, label, defaultValue = "" }) {
  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 pl-1">
          {label}
        </label>
      )}

      {/* Container surrounding editor frame */}
      <div className="rounded-2xl overflow-hidden border border-slate-300 dark:border-zinc-800 focus-within:border-indigo-600 dark:focus-within:border-violet-500/80 focus-within:ring-4 focus-within:ring-indigo-500/10 dark:focus-within:ring-violet-500/10 transition-all duration-300">
        <Controller
          name={name || "content"}
          control={control}
          render={({ field: { onChange } }) => (
            <Editor
              apiKey="whpx36wm2tij6ojmzkbt1h3dgpfopq2cx8k6xyeiw3g5z7ur"
              initialValue={defaultValue}
              init={{
                initialValue: defaultValue,
                height: 500,
                menubar: true,
                skin: isDark ? "oxide-dark" : "oxide",
                content_css: isDark ? "dark" : "default",
                plugins: [
                  "image", "advlist", "autolink", "lists", "link",
                  "charmap", "preview", "anchor", "searchreplace",
                  "visualblocks", "code", "fullscreen", "insertdatetime",
                  "media", "table", "help", "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | image | bold italic forecolor | \
                   alignleft aligncenter alignright alignjustify | \
                   bullist numlist outdent indent | removeformat | help",
                content_style: isDark
                  ? "body { font-family:Inter,Helvetica,Arial,sans-serif; font-size:15px; background-color: #18181b; color: #f4f4f5; }"
                  : "body { font-family:Inter,Helvetica,Arial,sans-serif; font-size:15px; background-color: #ffffff; color: #1e293b; }",
              }}
              onEditorChange={onChange}
            />
          )}
        />
      </div>
    </div>
  );
}
