"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Phone, Lock, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "../../providers/ToastProvider";

export default function FormPageSignin() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      showToast(errorParam, "error");
    }
  }, [searchParams, showToast]);

  async function onSubmit(e?: React.FormEvent, phone?: string, pass?: string) {
    if (e) e.preventDefault();
    
    const targetPhone = phone ?? phoneNumber;
    const targetPass = pass ?? password;

    if (!targetPhone || targetPhone.length < 10) {
      showToast("Please enter a valid 10-digit phone number.", "error");
      return;
    }
    if (!targetPass || targetPass.length < 6) {
      showToast("Password must be at least 6 characters.", "error");
      return;
    }

    setIsLoading(true);
    const toastId = showToast("Signing in...", "loading");

    try {
      const res = await signIn("signin", {
        phone: targetPhone,
        password: targetPass,
        redirect: false,
      });

      if (!res?.error) {
        showToast("Signed in successfully!", "success");
        router.push("/dashboard");
      } else {
        showToast("Invalid phone number or password.", "error");
      }
    } catch (err: any) {
      console.error(err);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md p-8 bg-white dark:bg-[#1a1a2e] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl transition-colors duration-300"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">Sign In</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">Access your secure ZenPay wallet</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Phone Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Phone Number
          </label>
          <div className="relative flex items-center">
            {/* IN +91 Prefix */}
            <div className="absolute left-3 flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg select-none border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold tracking-tight">IN</span>
              <span>+91</span>
            </div>
            <input
              type="tel"
              required
              disabled={isLoading}
              maxLength={10}
              placeholder="1231231230"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
              className="w-full pl-24 pr-4 py-3 bg-slate-50 dark:bg-[#0f0f1a] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 dark:focus:border-purple-500 disabled:opacity-60 transition duration-200"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              disabled={isLoading}
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-11 py-3 bg-slate-50 dark:bg-[#0f0f1a] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 dark:focus:border-purple-500 disabled:opacity-60 transition duration-200"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center justify-center gap-2 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-purple-500/10"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Demo credentials CTA */}
        <div className="flex justify-center border-t border-slate-100 dark:border-slate-800/60 pt-4">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => onSubmit(undefined, "1212121212", "121212")}
            className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:underline transition disabled:opacity-50"
          >
            Use Demo Credentials
          </button>
        </div>
      </form>

      {/* Nav footer */}
      <div className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400 flex flex-col gap-2">
        <div className="flex justify-center gap-1">
          <span>Forgot password?</span>
          <button
            onClick={() => router.push("/update/password")}
            className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
          >
            Reset password
          </button>
        </div>
        <div className="flex justify-center gap-1">
          <span>Don't have an account?</span>
          <button
            onClick={() => router.push("/auth/signup")}
            className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
          >
            Sign up
          </button>
        </div>
      </div>
    </motion.div>
  );
}
