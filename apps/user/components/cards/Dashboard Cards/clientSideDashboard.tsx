"use client";

import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { CreditCard, Eye, EyeOff, RefreshCw, ArrowUpRight, Plus } from 'lucide-react';
import { getBalance } from '../../../app/lib/actions/getBalance';
import { useRouter } from 'next/navigation';

interface MainCardDashboardProps {
  currency?: string;
}

export function MainCardDashboard({ currency = '₹' }: MainCardDashboardProps) {
  const [balance, setBalance] = useState<string>("0.00");
  const [lockedBalance, setLockedBalance] = useState<string>("0.00");
  const [toShow, setToShow] = useState<boolean>(true);
  const [updatedAt, setUpdatedAt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  // Framer Motion Values for counters
  const balanceCount = useMotionValue(0);
  const lockedCount = useMotionValue(0);

  const animatedBalance = useTransform(balanceCount, (latest) => latest.toFixed(2));
  const animatedLocked = useTransform(lockedCount, (latest) => latest.toFixed(2));

  const refreshBalance = async () => {
    setIsLoading(true);
    try {
      const data = await getBalance();
      const amt = (Number(data?.balance?.amount) / 100) || 0;
      const lockedAmt = (Number(data?.balance?.locked) / 100) || 0;

      // Animate from previous state to new state
      animate(balanceCount, amt, { duration: 1, ease: "easeOut" });
      animate(lockedCount, lockedAmt, { duration: 1, ease: "easeOut" });

      setBalance(amt.toFixed(2));
      setLockedBalance(lockedAmt.toFixed(2));
      setUpdatedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.error('Error fetching balance:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshBalance();
  }, []);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="col-span-1 lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-purple-500/10 border border-white/10 shimmer"
    >
      {/* Background decoration */}
      <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute left-1/3 top-10 w-48 h-48 bg-purple-500/20 rounded-full blur-xl pointer-events-none" />

      {/* Header of Balance Card */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-2.5 text-white/95">
          <CreditCard className="w-5 h-5 text-purple-200" />
          <span className="text-xs font-bold uppercase tracking-wider text-purple-100">Wallet Balance</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh button */}
          <button
            onClick={refreshBalance}
            disabled={isLoading}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition duration-150 disabled:opacity-50"
            title="Refresh balance"
          >
            <RefreshCw className={`w-4 h-4 text-white ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* Visibility toggle button */}
          <button
            onClick={() => setToShow(!toShow)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition duration-150"
            title={toShow ? 'Hide balance' : 'Show balance'}
          >
            {toShow ? <EyeOff className="w-4 h-4 text-white" /> : <Eye className="w-4 h-4 text-white" />}
          </button>
        </div>
      </div>

      {/* Balance Numbers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end relative z-10 my-4">
        {/* Unlocked Balance */}
        <div className="space-y-1">
          <span className="text-xs font-semibold text-purple-200">Available Balance</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-purple-200">{currency}</span>
            <span className="text-4xl sm:text-5xl font-black tracking-tight leading-none break-all">
              {toShow ? <motion.span>{animatedBalance}</motion.span> : '••••••'}
            </span>
          </div>
        </div>

        {/* Locked Balance */}
        <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-6">
          <span className="text-xs font-semibold text-purple-200">Locked Balance</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-purple-200">{currency}</span>
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-none break-all">
              {toShow ? <motion.span>{animatedLocked}</motion.span> : '••••••'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10 relative z-10 text-[10px] text-purple-200">
        <span>Active Wallet</span>
        {updatedAt && <span>Last updated: {updatedAt}</span>}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 relative z-10">
        <button
          onClick={() => router.push("/transfer/deposit")}
          className="flex-1 py-3 px-4 rounded-xl bg-white text-purple-700 hover:bg-purple-50 font-bold text-sm flex items-center justify-center gap-2 transition duration-200 shadow-lg shadow-purple-950/20 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Money</span>
        </button>
        <button
          onClick={() => router.push("/p2p")}
          className="flex-1 py-3 px-4 rounded-xl bg-purple-700/60 hover:bg-purple-700/80 border border-white/20 text-white font-bold text-sm flex items-center justify-center gap-2 transition duration-200 active:scale-[0.98]"
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Send Money</span>
        </button>
      </div>
    </motion.div>
  );
}

export function ActionCard({ icon, label, to, className = "" }: any) {
  const router = useRouter();
  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push(to)}
      className={`rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-sm border border-slate-100 dark:border-slate-800/80 transition-all duration-200 ${className}`}
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3">
        {icon}
      </div>
      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{label}</span>
    </motion.button>
  );
}
