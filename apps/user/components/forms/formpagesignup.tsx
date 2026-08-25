"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { User, Mail, Phone, Lock, ArrowRight, Loader2, KeyRound } from "lucide-react";
import { motion } from "framer-motion";
import { InputOTPGroup } from "../inputotpgroup";
import { useToast } from "../../providers/ToastProvider";

const nextReqSchema = z.object({
  contact: z.string().length(10),
  Name: z.string().min(1),
  email: z.string().email(),
});

const loginReqSchema = z.object({
  contact: z.string().length(10),
  Name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6).max(14),
  receivedOtpCode: z.string().length(4),
});

export default function FormPageSignup() {
  const [Name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState(false);
  const [receivedOtpCode, setReceivedOtpCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [resendClicked, setResendClicked] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoadingOtp, setIsLoadingOtp] = useState(false);
  const [OTPresponse, setOTPresponse] = useState("");
  const [isLoadingSignup, setIsLoadingSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const startTimer = () => {
    setTimeLeft(60);
    setTimerRunning(true);
  };

  const handleVerify = async () => {
    try {
      const res = await fetch("/api/auth/otp/verify-otp", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          otp: receivedOtpCode,
        }),
      });

      if (res.status === 200) {
        setOTPresponse("OTP Verified!!");
        return 200;
      } else if (res.status === 400) {
        setOTPresponse("Incorrect OTP. Please try again.");
        showToast("Incorrect OTP. Please try again.", "error");
        return 400;
      }
      return res.status;
    } catch (e) {
      console.error(e);
      return 500;
    }
  };

  const handleSendOtp = async () => {
    setIsLoadingOtp(true);
    startTimer();
    setResendClicked(true);
    const toastId = showToast("Sending OTP to email...", "loading");
    try {
      const res = await fetch("/api/auth/otp/send-otp", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          username: Name,
        }),
      });
      if (res.status === 200) {
        setOtp(true);
        showToast("OTP sent to your email successfully!", "success");
      } else {
        setOtp(false);
        showToast("Failed to send OTP. Please try again.", "error");
      }
      return res.status;
    } catch (e) {
      showToast("Error in sending OTP", "error");
    } finally {
      setIsLoadingOtp(false);
    }
  };

  const handleLogin = async () => {
    setIsLoadingSignup(true);
    const verifyStatus = await handleVerify();
    if (verifyStatus !== 200) {
      setIsLoadingSignup(false);
      return;
    }

    const signupToastId = showToast("Creating your account...", "loading");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          Name: Name,
          password: password,
          contact: contact,
        }),
      });

      if (res.status === 200) {
        // Authenticate the user right after successful registration
        try {
          const authRes = await signIn("signup", {
            name: Name,
            phone: contact,
            password: password,
            email: email,
            redirect: false,
          });

          if (authRes?.error) {
            showToast("Something went wrong during sign-in", "error");
          } else {
            showToast("Signed up successfully!", "success");
            router.push("/mpin/set");
          }
        } catch (e) {
          console.error("Error during authentication redirects:", e);
          showToast("Authentication redirect failed", "error");
        }
      } else {
        showToast("Error occurred during Sign Up.", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Failed to register. Please try again.", "error");
    } finally {
      setIsLoadingSignup(false);
    }
  };

  const resendOTP = () => {
    setTimerRunning(false);
    startTimer();
    setResendClicked(true);
    handleSendOtp();
  };

  useEffect(() => {
    let timer: any;
    if (timerRunning) {
      timer = setTimeout(() => {
        if (timeLeft > 0) {
          setTimeLeft((prevTime) => prevTime - 1);
        } else {
          setTimerRunning(false);
        }
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, timerRunning]);

  useEffect(() => {
    if (contact === "" || contact === null) {
      setOtp(false);
      setTimeLeft(60);
      setTimerRunning(false);
      setResendClicked(false);
    }
  }, [contact]);

  if (!mounted) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md p-8 bg-white dark:bg-[#1a1a2e] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl transition-colors duration-300"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">Sign Up</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">Create your secure ZenPay wallet</p>
      </div>

      <div className="space-y-6">
        {/* Step 1 Form Inputs */}
        <div className="space-y-5">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              First Name
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                required
                disabled={otp || isLoadingOtp}
                placeholder="John Doe"
                value={Name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-[#0f0f1a] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 dark:focus:border-purple-500 disabled:opacity-60 transition duration-200"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                required
                disabled={otp || isLoadingOtp}
                placeholder="johndoe2@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-[#0f0f1a] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 dark:focus:border-purple-500 disabled:opacity-60 transition duration-200"
              />
            </div>
          </div>

          {/* Phone Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Phone Number
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg select-none border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold tracking-tight">IN</span>
                <span>+91</span>
              </div>
              <input
                type="tel"
                required
                disabled={otp || isLoadingOtp}
                maxLength={10}
                placeholder="1231231230"
                value={contact}
                onChange={(e) => setContact(e.target.value.replace(/\D/g, ""))}
                className="w-full pl-24 pr-4 py-2.5 bg-slate-50 dark:bg-[#0f0f1a] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 dark:focus:border-purple-500 disabled:opacity-60 transition duration-200"
              />
            </div>
          </div>
        </div>

        {/* Step 2 Fields (OTP and Password Setup) */}
        {otp && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-5 border-t border-slate-100 dark:border-slate-850 pt-5"
          >
            {/* OTP Group */}
            <div className="space-y-2 flex flex-col items-center justify-center">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Enter 4-Digit OTP
              </label>
              <InputOTPGroup
                type="otp"
                onChangeFunc={(code: string) => setReceivedOtpCode(code)}
              />
              
              {/* Resend OTP countdown */}
              <div className="text-center mt-2">
                {resendClicked && timeLeft > 0 ? (
                  <p className="text-xs text-slate-500">
                    Resend code available in{" "}
                    <span className="text-purple-600 font-semibold">{timeLeft}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={resendOTP}
                    className="text-xs font-semibold text-purple-600 hover:text-purple-700 hover:underline transition"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Create Password (min 6 characters)
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-[#0f0f1a] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 dark:focus:border-purple-500 disabled:opacity-60 transition duration-200"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Primary Action Button */}
        {receivedOtpCode ? (
          <button
            type="button"
            disabled={isLoadingSignup}
            onClick={async () => {
              if (loginReqSchema.safeParse({ Name, contact, email, receivedOtpCode, password }).success) {
                await handleLogin();
              } else {
                showToast("Please fill in all fields correctly.", "error");
              }
            }}
            className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center justify-center gap-2 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-purple-500/10"
          >
            {isLoadingSignup ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Sign Up & Login</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            disabled={isLoadingOtp}
            onClick={async () => {
              setIsLoadingOtp(true);
              const isFormValid = nextReqSchema.safeParse({ Name, contact, email }).success;
              if (isFormValid && (timeLeft === 0 || firstTime)) {
                const resStatus = await handleSendOtp();
                if (resStatus === 400) {
                  showToast("An account already exists with this phone number or email.", "error");
                } else if (resStatus === 500) {
                  showToast("Something went wrong on the server.", "error");
                } else if (resStatus === 200) {
                  setFirstTime(false);
                }
              } else if (!isFormValid) {
                showToast("Please enter a valid name, email, and 10-digit phone number.", "error");
              }
              setIsLoadingOtp(false);
            }}
            className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center justify-center gap-2 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-purple-500/10"
          >
            {isLoadingOtp ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Send OTP Verification</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Nav footer */}
      <div className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="flex justify-center gap-1">
          <span>Already have an account?</span>
          <button
            onClick={() => router.push("/auth/signin")}
            className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
          >
            Sign in
          </button>
        </div>
      </div>
    </motion.div>
  );
}