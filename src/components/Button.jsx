import React from "react";

export default function Button({
  children,
  type = "button",
  bgColor, // will use premium gradient as default if none provided
  textColor = "text-white",
  className = "",
  ...props 
}) {
  // Use a stunning, default purple-to-indigo gradient if no specific background color is passed
  const activeBg = bgColor || "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500";
  
  // Custom styled button with smooth transitions and click active scale states
  const buttonStyle = `px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 active:scale-[0.98] shadow-lg shadow-violet-500/10 hover:shadow-violet-500/25 hover:scale-[1.01] cursor-pointer ${activeBg} ${textColor} ${className}`;

  return (
    <button
      type={type}
      className={buttonStyle}
      {...props}
    >
      {children}
    </button>
  );
}
