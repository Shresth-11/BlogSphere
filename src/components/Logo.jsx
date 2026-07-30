import React from "react";

function Logo() {
  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Hexagonal Gradient Emblem */}
      <svg
        className="w-8 h-8 drop-shadow-[0_2px_8px_rgba(99,102,241,0.3)]"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="50%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <path
          d="M50 5L90 28.1V74.4L50 97.5L10 74.4V28.1L50 5Z"
          stroke="url(#logoGrad)"
          strokeWidth="8"
          strokeLinejoin="round"
        />
        <path
          d="M50 25L72 37.7V63.3L50 76L28 63.3V37.7L50 25Z"
          fill="url(#logoGrad)"
          opacity="0.9"
        />
      </svg>
      <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
        Blog<span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">Sphere</span>
      </span>
    </div>
  );
}

export default Logo;