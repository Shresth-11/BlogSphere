import React from "react";
import { Container, Logo, LogoutBtn } from "../index";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true,
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
  ];

  return (
    <header className="sticky top-0 z-50 py-3.5 w-full border-b border-zinc-900/85 bg-zinc-950/60 backdrop-blur-lg transition-all duration-500 shadow-xl shadow-black/10 select-none">
      <Container>
        <nav className="flex items-center justify-between">
          {/* Brand Logo Link */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center hover:opacity-95 active:scale-[0.98] transition-all duration-300">
              <Logo />
            </Link>
          </div>
          
          {/* Navigation Items */}
          <ul className="flex items-center gap-2.5">
            {navItems.map((item) => {
              if (!item.active) return null;
              
              const isActive = location.pathname === item.slug;
              
              // Styling for CTA items (Login, Signup) versus standard tabs
              const isCTA = item.slug === "/login" || item.slug === "/signup";
              
              if (isCTA) {
                const isSignup = item.slug === "/signup";
                return (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.slug)}
                      className={`px-5 py-2 text-sm font-bold rounded-xl transition-all duration-300 active:scale-[0.97] ${
                        isSignup
                          ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/35 hover:scale-[1.02] cursor-pointer"
                          : "text-zinc-300 hover:text-white bg-zinc-900/80 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 hover:scale-[1.02] cursor-pointer"
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
                    className={`relative px-4.5 py-2 text-sm font-semibold rounded-xl transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "text-violet-400 bg-violet-500/10"
                        : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/40"
                    }`}
                  >
                    {item.name}
                    {isActive && (
                      <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-violet-400 rounded-full animate-pulse" />
                    )}
                  </button>
                </li>
              );
            })}
            
            {authStatus && (
              <li className="ml-1.5">
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
