import React from "react";

export default function Button({
  children,
  type = "button",
  bgColor,
  textColor = "text-white",
  className = "",
  ...props 
}) {
  const activeBg = bgColor || "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35";
  
  const buttonStyle = `px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 active:scale-[0.98] hover:scale-[1.01] cursor-pointer ${activeBg} ${textColor} ${className}`;

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
