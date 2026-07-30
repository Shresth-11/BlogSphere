import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";
import { Button, Input, Logo } from "./index";
import { useDispatch } from "react-redux";
import authService from "../appwrite/auth";
import { useForm } from "react-hook-form";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (data) => {
    setError("");
    setLoading(true);
    try {
      const session = await authService.login(data);
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) dispatch(authLogin(userData));
        navigate("/");
      }
    } catch (error) {
      const rawMsg = error?.message || "";
      if (rawMsg.toLowerCase().includes("paused") || rawMsg.toLowerCase().includes("inactivity")) {
        setError("Service is temporarily undergoing brief maintenance. Please try again in a few moments.");
      } else {
        setError(rawMsg || "Something went wrong. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-[70vh] py-12 px-4 relative overflow-hidden select-none">
      {/* Visual background glow shapes */}
      <div className="absolute top-1/4 left-1/3 w-60 h-60 rounded-full bg-indigo-500/5 dark:bg-violet-600/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-60 h-60 rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

      {/* Auth Panel */}
      <div className="mx-auto w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900/40 border border-slate-200/90 dark:border-zinc-800/80 p-8 sm:p-10 backdrop-blur-md shadow-xl shadow-slate-200/50 dark:shadow-2xl relative z-10">
        {/* Brand Logo Header */}
        <div className="mb-6 flex justify-center">
          <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
            <Logo />
          </Link>
        </div>

        <h2 className="text-center text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-zinc-400">
          Don&apos;t have an account?&nbsp;
          <Link
            to="/signup"
            className="font-bold text-indigo-600 dark:text-violet-400 hover:text-indigo-700 dark:hover:text-violet-300 transition-colors duration-200"
          >
            Sign Up
          </Link>
        </p>

        {/* Clean Public Error Alert */}
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs font-semibold text-center leading-relaxed">
            ⚠️ {error}
          </div>
        )}

        {/* Input Form Fields */}
        <form onSubmit={handleSubmit(login)} className="mt-6">
          <div className="flex flex-col gap-5">
            <Input
              label="Email Address"
              placeholder="Enter your email"
              type="email"
              autoComplete="email"
              {...register("email", {
                required: "Email is required",
                validate: {
                  matchPattern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              {...register("password", {
                required: "Password is required",
              })}
            />

            <Button
              type="submit"
              className="w-full mt-2 font-bold cursor-pointer py-3"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
