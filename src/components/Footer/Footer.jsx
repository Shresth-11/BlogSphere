import React from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo";

function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-12 mt-20 relative transition-colors duration-300">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12">
        <div className="-m-6 flex flex-wrap justify-between">
          
          {/* Logo and Copyright Column */}
          <div className="w-full p-6 md:w-1/2 lg:w-4/12 flex flex-col justify-between gap-6 text-left">
            <div className="flex flex-col gap-3">
              <div className="inline-flex items-center">
                <Logo />
              </div>
              <p className="text-sm text-slate-600 dark:text-zinc-400 max-w-xs leading-relaxed">
                An open platform for articles, tutorials, and personal stories.
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-zinc-500 font-medium">
                &copy; {new Date().getFullYear()} BlogSphere. All rights reserved.
              </p>
            </div>
          </div>
          
          {/* Menu Columns */}
          <div className="w-full p-6 sm:w-1/2 md:w-1/4 lg:w-2/12 text-left">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              Platform
            </h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors" to="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors" to="/all-posts">
                  Articles
                </Link>
              </li>
              <li>
                <Link className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors" to="/add-post">
                  Write a Post
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="w-full p-6 sm:w-1/2 md:w-1/4 lg:w-2/12 text-left">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              Account
            </h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors" to="/login">
                  Sign In
                </Link>
              </li>
              <li>
                <Link className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors" to="/signup">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          <div className="w-full p-6 sm:w-1/2 md:w-1/4 lg:w-2/12 text-left">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              Legal
            </h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors" to="/">
                  Terms &amp; Privacy
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
