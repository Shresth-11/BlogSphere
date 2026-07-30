import React from "react";

function Container({ children }) {
  return <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">{children}</div>;
}

export default Container;
