import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import authService from "./appwrite/auth";
import { login, logout } from "./store/authSlice";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { Outlet } from "react-router-dom";
import { useTheme } from "./hooks/useTheme";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login(userData));
        } else {
          dispatch(logout());
        }
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  return !loading ? (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col justify-between transition-colors duration-300">
      <div className="w-full">
        <Header theme={theme} toggleTheme={toggleTheme} />
        <main className="w-full min-h-[70vh]">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  ) : (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col justify-center items-center gap-4 text-slate-800 dark:text-zinc-100 selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      {/* Pulsing Spinner */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute w-full h-full rounded-full border-4 border-indigo-500/20 dark:border-violet-500/20"></div>
        <div className="absolute w-full h-full rounded-full border-4 border-t-indigo-600 dark:border-t-violet-500 border-r-cyan-500 animate-spin"></div>
        <div className="w-6 h-6 rounded-full bg-indigo-500/30 animate-pulse"></div>
      </div>
      <span className="text-sm font-semibold tracking-widest uppercase bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-violet-400 dark:to-cyan-400 bg-clip-text text-transparent animate-pulse">
        Initializing BlogSphere...
      </span>
    </div>
  );
}

export default App;
