interface BalanceCardProps {
  amount: number;
  locked: number;
}

export function BalanceCard({ amount, locked }: BalanceCardProps) {
  const total = amount + locked;

  return (
    <div className="p-6 bg-white dark:bg-[#1a1a2e] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-md font-bold text-slate-800 dark:text-slate-200">Balances Summary</h3>
        <p className="text-[11px] text-slate-400 dark:text-slate-500">Real-time status of your wallet assets</p>
      </div>

      <div className="space-y-4">
        {/* Unlocked Balance */}
        <div className="flex justify-between items-center text-sm py-1">
          <span className="font-semibold text-slate-600 dark:text-slate-400">Available Balance</span>
          <span className="font-extrabold text-slate-800 dark:text-slate-100">
            ₹{(amount / 100).toFixed(2)}
          </span>
        </div>

        {/* Total Locked Balance */}
        <div className="flex justify-between items-center text-sm py-1 border-t border-slate-50 dark:border-slate-800/40 pt-3">
          <span className="font-semibold text-slate-600 dark:text-slate-400">Locked Balance</span>
          <span className="font-extrabold text-slate-800 dark:text-slate-100">
            ₹{(locked / 100).toFixed(2)}
          </span>
        </div>

        {/* Total Balance */}
        <div className="flex justify-between items-center text-sm py-1 border-t border-slate-100 dark:border-slate-800 pt-3">
          <span className="font-bold text-purple-600 dark:text-purple-400">Total Asset Value</span>
          <span className="font-black text-purple-600 dark:text-purple-400 text-base">
            ₹{(total / 100).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
