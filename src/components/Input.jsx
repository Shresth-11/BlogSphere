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
          className="text-xs font-semibold uppercase tracking-wider text-zinc-400 pl-1"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        className={`px-4 py-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-white outline-none focus:border-violet-500/80 focus:ring-4 focus:ring-violet-500/10 placeholder-zinc-600 transition-all duration-300 w-full text-sm font-medium ${className}`}
        ref={ref}
        {...props}
        id={id}
      />
    </div>
  );
});

export default Input;
