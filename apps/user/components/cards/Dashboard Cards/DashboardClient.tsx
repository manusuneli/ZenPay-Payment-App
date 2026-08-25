"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Users, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  History, 
  Receipt, 
  Zap, 
  Calendar,
  AlertCircle,
  CreditCard
} from "lucide-react";
import { MainCardDashboard, ActionCard } from "./clientSideDashboard";

interface Transaction {
  id: number;
  type: string;
  time: string;
  title: string;
  subtext: string;
  direction: "credit" | "debit";
  status: "Success" | "Failure" | "Processing";
  amount: number;
}

interface DashboardClientProps {
  monthlySpending: string;
  NumDepositBankTransfers: number;
  NumWithdrawBankTransfers: number;
  NumP2PTransfers: number;
  CountSplits: number;
  combinedTxns: Transaction[];
}

export default function DashboardClient({
  monthlySpending,
  NumDepositBankTransfers,
  NumWithdrawBankTransfers,
  NumP2PTransfers,
  CountSplits,
  combinedTxns
}: DashboardClientProps) {
  const router = useRouter();

  // Animation variants for staggered child entries
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-14"
    >
      {/* Page Title */}
      <motion.div variants={itemVariants} className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Overview of your payment history & account stats</p>
        </div>
      </motion.div>

      {/* Main Grid: Hero Balance & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Balance Card Component (takes 2 columns on desktop) */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <MainCardDashboard />
        </motion.div>

        {/* Quick Actions Card */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-[#1a1a2e] rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-850 flex flex-col justify-between"
        >
          <div className="mb-4">
            <h3 className="text-md font-bold text-slate-800 dark:text-slate-200">Quick Actions</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Perform instant wallet actions</p>
          </div>
          <div className="grid grid-cols-2 gap-4 flex-1">
            <ActionCard
              icon={<ArrowUpRight className="w-6 h-6 text-green-600 dark:text-green-400" />}
              label="Send Money"
              to="/p2p"
              className="bg-green-50/50 hover:bg-green-50 dark:bg-green-950/10 dark:hover:bg-green-950/20"
            />
            <ActionCard
              icon={<ArrowDownLeft className="w-6 h-6 text-red-600 dark:text-red-400" />}
              label="Withdraw"
              to="/transfer/withdraw"
              className="bg-red-50/50 hover:bg-red-50 dark:bg-red-950/10 dark:hover:bg-red-950/20"
            />
            <ActionCard
              icon={<Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
              label="Split Bill"
              to="/split-bill"
              className="bg-blue-50/50 hover:bg-blue-50 dark:bg-blue-950/10 dark:hover:bg-blue-950/20"
            />
            <ActionCard
              icon={<Plus className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
              label="Add Money"
              to="/transfer/deposit"
              className="bg-purple-50/50 hover:bg-purple-50 dark:bg-purple-950/10 dark:hover:bg-purple-950/20"
            />
          </div>
        </motion.div>
      </div>

      {/* Stats Cards Section */}
      <motion.div variants={itemVariants} className="mb-8">
        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Account Analytics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          
          {/* Monthly Spending */}
          <div className="bg-white dark:bg-[#1a1a2e] p-5 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm flex flex-col justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Total Spent</span>
            <span className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-2 truncate">{monthlySpending}</span>
          </div>

          {/* Friends Paid */}
          <div className="bg-white dark:bg-[#1a1a2e] p-5 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm flex flex-col justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">P2P Transfers</span>
            <span className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-2">{NumP2PTransfers} txs</span>
          </div>

          {/* Deposits count */}
          <div className="bg-white dark:bg-[#1a1a2e] p-5 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm flex flex-col justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Deposits</span>
            <span className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-2">{NumDepositBankTransfers} txs</span>
          </div>

          {/* Withdrawals count */}
          <div className="bg-white dark:bg-[#1a1a2e] p-5 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm flex flex-col justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Withdrawals</span>
            <span className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-2">{NumWithdrawBankTransfers} txs</span>
          </div>

          {/* Split Bills count */}
          <div className="bg-white dark:bg-[#1a1a2e] p-5 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm flex flex-col justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Bills Split</span>
            <span className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-2">{CountSplits}</span>
          </div>

          {/* Linked Cards link */}
          <div 
            onClick={() => router.push("/accounts")}
            className="bg-white dark:bg-[#1a1a2e] p-5 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm flex flex-col justify-between cursor-pointer hover:border-purple-500 transition duration-200"
          >
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
              Manage Cards
            </span>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 mt-2 flex items-center gap-1">
              View Cards <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>

        </div>
      </motion.div>

      {/* Recent Transactions Section */}
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-[#1a1a2e] p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-850"
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-md font-bold text-slate-800 dark:text-slate-200">Recent Transactions</h3>
          </div>
          <button 
            onClick={() => router.push("/transactions/deposit")}
            className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
          >
            View All Transactions <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {combinedTxns.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
            <AlertCircle className="w-10 h-10 text-slate-300 dark:text-slate-600" />
            <p className="text-xs text-slate-500 dark:text-slate-400">No transactions recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                  <th className="pb-3 pl-2">Recipient / Sender</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Date & Time</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-2">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {combinedTxns.map((txn, index) => {
                  const initials = txn.title
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase();
                    
                  const isDebit = txn.direction === "debit";
                  const dateStr = new Date(txn.time).toLocaleDateString([], { month: "short", day: "numeric" });
                  const timeStr = new Date(txn.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                  return (
                    <tr key={index} className="text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition duration-150">
                      {/* Recipient / Sender Info */}
                      <td className="py-4 pl-2 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs">
                          {initials}
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{txn.title}</span>
                      </td>

                      {/* Transaction Type */}
                      <td className="py-4">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {txn.subtext}
                        </span>
                      </td>

                      {/* Timestamp */}
                      <td className="py-4 text-slate-500 dark:text-slate-400 text-xs">
                        <span className="font-medium">{dateStr}</span>
                        <span className="mx-1 text-slate-300 dark:text-slate-700">•</span>
                        <span>{timeStr}</span>
                      </td>

                      {/* Status Badges */}
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          txn.status === "Success" 
                            ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                            : txn.status === "Processing"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                            : "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                        }`}>
                          {txn.status}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-4 text-right pr-2">
                        {txn.status === "Processing" ? (
                          <span className="font-bold text-slate-700 dark:text-slate-200">
                            ₹{(txn.amount / 100).toFixed(2)}
                          </span>
                        ) : (
                          <span className={`font-bold ${isDebit ? 'text-red-500' : 'text-green-600'}`}>
                            {isDebit ? "-" : "+"} ₹{(Math.abs(txn.amount) / 100).toFixed(2)}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
