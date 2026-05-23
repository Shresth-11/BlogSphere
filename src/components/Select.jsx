import React, { useId } from "react";

function Select({ options, label, className = "", ...props }, ref) {
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

      <select
        {...props}
        id={id}
        ref={ref}
        className={`px-4 py-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-white outline-none focus:border-violet-500/80 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300 w-full text-sm font-medium cursor-pointer ${className}`}
      >
        {options?.map((option) => (
          <option
            key={option}
            value={option}
            className="bg-zinc-900 text-zinc-100 font-medium py-2"
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default React.forwardRef(Select);
