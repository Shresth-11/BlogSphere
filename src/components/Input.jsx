import React, { useId } from "react";

const Input = React.forwardRef(function Input(
  { label, type = "text", className = "", ...props },
  ref,
) {
  const id = useId();
  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label
          className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 pl-1"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        className={`px-4 py-2.5 rounded-xl bg-slate-100/80 dark:bg-zinc-900/60 border border-slate-300 dark:border-zinc-800 text-slate-900 dark:text-white outline-none focus:bg-white dark:focus:bg-zinc-900 focus:border-indigo-600 dark:focus:border-violet-500/80 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-violet-500/10 placeholder-slate-400 dark:placeholder-zinc-600 transition-all duration-300 w-full text-sm font-medium ${className}`}
        ref={ref}
        {...props}
        id={id}
      />
    </div>
  );
});

export default Input;
