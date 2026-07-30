import { useState, useEffect } from "react";

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem("blogsphere_theme_v2");
      if (savedTheme === "dark") {
        return "dark";
      }
    } catch (e) {
      console.error("useTheme error reading localStorage:", e);
    }
    // Default to Light theme
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
    try {
      localStorage.setItem("blogsphere_theme_v2", theme);
    } catch (e) {
      console.error("useTheme error setting localStorage:", e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return { theme, setTheme, toggleTheme };
}
