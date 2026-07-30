import React from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo";

function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-zinc-900 bg-slate-100/70 dark:bg-zinc-950/60 backdrop-blur-md py-12 mt-20 relative overflow-hidden transition-colors duration-300">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-indigo-500/5 dark:bg-violet-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-cyan-500/5 dark:bg-cyan-600/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="-m-6 flex flex-wrap justify-between">
          
          {/* Logo and Copyright Column */}
          <div className="w-full p-6 md:w-1/2 lg:w-4/12 flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center">
                <Logo />
              </div>
              <p className="text-sm text-slate-600 dark:text-zinc-400 max-w-xs leading-relaxed">
                Empowering writers, designers, and developers to share their stories with the world. Built with Appwrite and React.
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-zinc-500 font-medium">
                &copy; Copyright {new Date().getFullYear()}. All Rights Reserved by BlogSphere.
              </p>
            </div>
          </div>
          
          {/* Menu Columns */}
          <div className="w-full p-6 sm:w-1/2 md:w-1/4 lg:w-2/12">
            <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
              Company
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-white transition-colors duration-200" to="/">
                  Features
                </Link>
              </li>
              <li>
                <Link className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-white transition-colors duration-200" to="/">
                  Pricing
                </Link>
              </li>
              <li>
                <Link className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-white transition-colors duration-200" to="/">
                  Affiliate Program
                </Link>
              </li>
              <li>
                <Link className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-white transition-colors duration-200" to="/">
                  Press Kit
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="w-full p-6 sm:w-1/2 md:w-1/4 lg:w-2/12">
            <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
              Support
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-white transition-colors duration-200" to="/">
                  Account
                </Link>
              </li>
              <li>
                <Link className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-white transition-colors duration-200" to="/">
                  Help Center
                </Link>
              </li>
              <li>
                <Link className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-white transition-colors duration-200" to="/">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-white transition-colors duration-200" to="/">
                  Customer Support
                </Link>
              </li>
            </ul>
          </div>

          <div className="w-full p-6 sm:w-1/2 md:w-1/4 lg:w-2/12">
            <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
              Legals
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-white transition-colors duration-200" to="/">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-white transition-colors duration-200" to="/">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-white transition-colors duration-200" to="/">
                  Licensing
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
