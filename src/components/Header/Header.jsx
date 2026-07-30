import React, { useState } from "react";
import { Container, Logo, LogoutBtn } from "../index";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTheme } from "../../hooks/useTheme";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },
    {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
  ];

  return (
    <header className="sticky top-0 z-50 py-3.5 w-full border-b border-slate-200/90 dark:border-zinc-900/85 bg-white/80 dark:bg-zinc-950/70 backdrop-blur-xl transition-all duration-300 shadow-sm shadow-slate-200/50 dark:shadow-xl dark:shadow-black/20 select-none">
      <Container>
        <nav className="flex items-center justify-between">
          {/* Brand Logo Link */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center hover:opacity-95 active:scale-[0.98] transition-all duration-300"
            >
              <Logo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            <ul className="flex items-center gap-2">
              {navItems.map((item) => {
                if (!item.active) return null;

                const isActive = location.pathname === item.slug;
                const isCTA = item.slug === "/login" || item.slug === "/signup";

                if (isCTA) {
                  const isSignup = item.slug === "/signup";
                  return (
                    <li key={item.name}>
                      <button
                        onClick={() => navigate(item.slug)}
                        className={`px-5 py-2 text-sm font-bold rounded-xl transition-all duration-300 active:scale-[0.97] cursor-pointer ${
                          isSignup
                            ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:scale-[1.02]"
                            : "text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 hover:bg-slate-200/80 dark:hover:bg-zinc-800 hover:scale-[1.02]"
                        }`}
                      >
                        {item.name}
                      </button>
                    </li>
                  );
                }

                return (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.slug)}
                      className={`relative px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "text-indigo-600 dark:text-violet-400 bg-indigo-50 dark:bg-violet-500/10"
                          : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-900/40"
                      }`}
                    >
                      {item.name}
                      {isActive && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-indigo-600 dark:bg-violet-400 rounded-full animate-pulse" />
                      )}
                    </button>
                  </li>
                );
              })}

              {authStatus && (
                <li className="ml-1">
                  <LogoutBtn />
                </li>
              )}
            </ul>

            {/* Theme Switcher Button */}
            <div className="pl-2 border-l border-slate-200 dark:border-zinc-800">
              <button
                onClick={toggleTheme}
                title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-zinc-900/80 dark:hover:bg-zinc-800 border border-slate-200/90 dark:border-zinc-800 text-slate-700 dark:text-amber-400 transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center"
              >
                {theme === "dark" ? (
                  /* Sun Icon */
                  <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  /* Moon Icon */
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-amber-400"
            >
              {theme === "dark" ? (
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-200"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xl flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
            {navItems.map((item) => {
              if (!item.active) return null;
              const isActive = location.pathname === item.slug;

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.slug);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600 dark:bg-violet-500/20 dark:text-violet-300"
                      : "text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {item.name}
                </button>
              );
            })}

            {authStatus && (
              <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
                <LogoutBtn />
              </div>
            )}
          </div>
        )}
      </Container>
    </header>
  );
}

export default Header;
