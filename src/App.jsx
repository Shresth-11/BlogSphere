import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import authService from "./appwrite/auth";
import { login, logout } from "./store/authSlice";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { Outlet } from "react-router-dom";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

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
    <div className="min-h-screen bg-zinc-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] flex flex-col justify-between">
      <div className="w-full">
        <Header />
        <main className="min-h-[70vh]">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  ) : (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center gap-4 text-zinc-100 selection:bg-violet-500 selection:text-white">
      {/* Premium Neon Pulsing Spinner */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute w-full h-full rounded-full border-4 border-violet-500/20"></div>
        <div className="absolute w-full h-full rounded-full border-4 border-t-violet-500 border-r-cyan-400 animate-spin"></div>
        <div className="w-6 h-6 rounded-full bg-indigo-500/30 animate-pulse"></div>
      </div>
      <span className="text-sm font-semibold tracking-widest uppercase bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
        Initializing...
      </span>
    </div>
  );
}

export default App;
