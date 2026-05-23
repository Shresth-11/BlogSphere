import React from 'react'

function Logo() {
  return (
    <div className="flex items-center gap-2 select-none">
      {/* Premium Hexagonal Gradient Geometric Emblem */}
      <svg
        className="w-8 h-8 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#22d3ee" />
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
          opacity="0.85"
        />
      </svg>
      <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
        Mega<span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Blog</span>
      </span>
    </div>
  )
}

export default Logo