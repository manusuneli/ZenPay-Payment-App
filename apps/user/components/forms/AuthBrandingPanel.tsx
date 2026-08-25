"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, TrendingUp, Wallet } from "lucide-react";

export default function AuthBrandingPanel({ text }: { text: string }) {
  const features = [
    { icon: <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />, title: "Bank-grade security" },
    { icon: <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />, title: "Instant P2P transfers" },
    { icon: <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />, title: "Smart financial insights" }
  ];

  return (
    <div className="hidden md:flex w-1/2 relative text-white p-12 lg:p-16 flex-col justify-between overflow-hidden bg-gradient-to-br from-purple-700 to-indigo-900 h-full min-h-screen">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_70%)] z-0" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />

      {/* Header Logo */}
      <div className="z-10 flex items-center gap-2">
        <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
          <Wallet className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-black tracking-tight text-white select-none">ZenPay</span>
      </div>

      {/* Hero Welcome Text */}
      <div className="z-10 max-w-md my-auto space-y-4 pt-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl lg:text-5xl font-black tracking-tight leading-tight select-none"
        >
          Welcome to ZenPay
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-lg text-purple-100/90 leading-relaxed font-medium"
        >
          {text}
        </motion.p>
      </div>

      {/* Feature cards */}
      <div className="z-10 grid gap-4 w-full max-w-sm">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.1, type: "spring", stiffness: 100 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg cursor-default select-none"
          >
            <div className="p-2 bg-white rounded-xl shadow-md flex-shrink-0">
              {feature.icon}
            </div>
            <span className="font-semibold text-sm text-white">{feature.title}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
