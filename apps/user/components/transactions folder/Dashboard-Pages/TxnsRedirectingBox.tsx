import Link from "next/link";
import { ArrowRight, AlertCircle } from "lucide-react";
import { RiArrowRightUpLine, RiArrowRightDownLine } from "react-icons/ri";

interface TransactionCardProps {
  amount: number;
  time: Date;
  status: string;
  provider: string;
}

export interface P2PTransactionStyleProps {
  id: number;
  amount: number;
  time: Date;
  toUserId: number;
  toUserName: string;
  paymentModeP2P: "paid" | "received";
  type: "SPLIT" | "P2P" | null;
}

export function TransactionCard({
  transactions,
  href,
}: {
  transactions: TransactionCardProps[];
  href: string;
}) {
  const isWithdraw = href.toLowerCase().includes("withdraw");

  return (
    <div className="p-6 bg-white dark:bg-[#1a1a2e] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-md font-bold text-slate-800 dark:text-slate-200">Recent Bank Transfers</h3>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">Last transfers with external banks</p>
        </div>
      </div>

      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="py-8 text-center flex flex-col items-center justify-center gap-2">
            <AlertCircle className="w-8 h-8 text-slate-350" />
            <p className="text-xs text-slate-400">No transfers found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 5).map((txn, index) => {
              const initials = txn.provider
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();
              
              const dateStr = new Date(txn.time).toLocaleDateString([], { month: "short", day: "numeric" });

              return (
                <div key={index} className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs">
                      {initials}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{txn.provider}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">{dateStr}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      txn.status === "Success" 
                        ? "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400"
                        : txn.status === "Processing"
                        ? "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                        : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                    }`}>
                      {txn.status}
                    </span>

                    <span className={`font-bold ${isWithdraw ? 'text-red-500' : 'text-green-600'}`}>
                      {isWithdraw ? "-" : "+"} ₹{(txn.amount / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <Link href={href} className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1">
            View all transfers <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function P2PTransactions({
  transactions,
}: {
  transactions: P2PTransactionStyleProps[];
}) {
  return (
    <div className="w-full">
      {!transactions || transactions.length === 0 ? (
        <Card title="Recent Transactions">
          <div className="mx-2 text-center font-bold py-6 w-full text-sm">
            No Recent transactions
          </div>
        </Card>
      ) : (
        <Card title="Recent Transactions" IsviewAll>
          <div className="overflow-x-auto max-h-72 sm:max-h-60">
            <table className="min-w-full table-auto divide-y divide-gray-200 text-xs sm:text-sm md:text-base">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-left font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-left font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-left font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-right font-semibold text-gray-700">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((tx) => (
                  <P2PTransactionStyle key={tx.id} transaction={tx} />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

export default function P2PTransactionStyle({
  transaction,
}: {
  transaction: P2PTransactionStyleProps;
}) {
  const isPaid = transaction.paymentModeP2P === "paid";
  const sign = isPaid ? "-" : "+";
  const amountColor = isPaid ? "text-red-600" : "text-green-600";
  const actionText = isPaid ? "Sent" : "Received";
  const formattedAmount = Math.abs(transaction.amount / 100).toFixed(2);
  const formattedDate = transaction.time.toLocaleDateString();
  const formattedTime = transaction.time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <tr className="bg-white hover:bg-gray-100 transition-colors text-[10px] sm:text-xs md:text-sm">
      <td className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 flex items-center gap-1 sm:gap-2 w-max max-w-[10rem] truncate">
        {isPaid ? (
          <RiArrowRightUpLine className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 shrink-0" />
        ) : (
          <RiArrowRightDownLine className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 shrink-0" />
        )}
        <span className="text-gray-900 font-medium truncate">{transaction.toUserName}</span>
      </td>
      <td className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-gray-600 whitespace-nowrap w-max">
        {transaction.type || "-"}
      </td>
      <td className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-gray-600 whitespace-nowrap truncate w-max">
        {formattedDate} • {formattedTime}
      </td>
      <td className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-right font-semibold ${amountColor} whitespace-nowrap w-max`}>
        {sign} ₹{formattedAmount}
      </td>
    </tr>
  );
}
