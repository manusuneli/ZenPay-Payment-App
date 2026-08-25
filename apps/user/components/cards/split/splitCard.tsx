import React from "react";
import { Clock, CreditCard, ListTodo, Zap } from "lucide-react";

interface CardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  borderClass: string;
}

export function SplitBillCards({
  paymentsPending,
  pendingCredits,
  totalSplits,
  activeSplits,
}: {
  paymentsPending: number;
  pendingCredits: number;
  totalSplits: number;
  activeSplits: number;
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card
        icon={<Clock className="text-purple-600 dark:text-purple-400 w-5 h-5" />}
        label="Pending Payments"
        value={`₹${paymentsPending.toFixed(2)}`}
        borderClass="border-l-purple-500"
      />
      <Card
        icon={<CreditCard className="text-green-600 dark:text-green-400 w-5 h-5" />}
        label="Pending Credits"
        value={`₹${pendingCredits.toFixed(2)}`}
        borderClass="border-l-green-500"
      />
      <Card
        icon={<ListTodo className="text-blue-600 dark:text-blue-400 w-5 h-5" />}
        label="Total Splits"
        value={totalSplits}
        borderClass="border-l-blue-500"
      />
      <Card
        icon={<Zap className="text-amber-500 dark:text-amber-400 w-5 h-5" />}
        label="Active Splits"
        value={activeSplits}
        borderClass="border-l-amber-500"
      />
    </div>
  );
}

function Card({ icon, label, value, borderClass }: CardProps) {
  return (
    <div className={`p-4 bg-white dark:bg-[#1a1a2e] rounded-2xl border-y border-r border-l-4 border-slate-200/60 dark:border-slate-800 ${borderClass} shadow-sm transition-colors duration-300`}>
      <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
        {icon}
        <h4 className="text-xs font-semibold uppercase tracking-wider">{label}</h4>
      </div>
      <p className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  );
}
