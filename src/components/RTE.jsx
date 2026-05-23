import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";

export default function RTE({ name, control, label, defaultValue = "" }) {
  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 pl-1">
          {label}
        </label>
      )}

      {/* Modern styled container surrounding editor frame */}
      <div className="rounded-2xl overflow-hidden border border-zinc-800 focus-within:border-violet-500/80 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all duration-300">
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
                skin: "oxide-dark",
                content_css: "dark",
                plugins: [
                  "image","advlist", "autolink", "lists", "link",
                  "image","charmap", "preview",  "anchor", "searchreplace",
                   "visualblocks", "code", "fullscreen","insertdatetime",
                  "media", "table",  "code","help","wordcount", "anchor",
                ],
                toolbar:
                  "undo redo | blocks | image | bold italic forecolor | \
                   alignleft aligncenter bold italic forecolor | \
                   alignleft aligncenter alignright alignjustify | \
                   bullist numlist outdent indent | removeformat | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; background-color: #18181b; color: #f4f4f5; }",
              }}
              onEditorChange={onChange}
            />
          )}
        />
      </div>
    </div>
  );
}
