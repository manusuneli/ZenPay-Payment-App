import { Card } from "@repo/ui/card";
import { RiArrowRightUpLine, RiArrowRightDownLine } from "react-icons/ri";

export interface P2PTransactionStyleProps {
  id: number;
  amount: number;
  time: Date;
  toUserId: number;
  toUserName: string;
  paymentModeP2P: "paid" | "received";
  type: "SPLIT" | "P2P" | null;
}

export function P2PTxStyle({
  transactions,
}: {
  transactions: P2PTransactionStyleProps[];
}) {
  return (
    <div className="w-full">
      <Card title="Recent P2P Transactions">
        {(!transactions || transactions.length === 0) ? (
          <div className="mx-2 text-center font-bold py-4 w-full text-xs sm:text-sm">
            No Recent transactions
          </div>
        ) : (
          <div className="overflow-x-auto max-h-80 w-full">
            <table className="min-w-full w-full table-auto divide-y divide-gray-200 text-[11px] sm:text-xs md:text-sm">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-1 sm:px-3 py-2 text-left font-semibold text-gray-700">Name</th>
                  <th className="px-1 sm:px-3 py-2 text-left font-semibold text-gray-700">Type</th>
                  <th className="px-1 sm:px-3 py-2 text-left font-semibold text-gray-700">Payment</th>
                  <th className="px-1 sm:px-3 py-2 text-left font-semibold text-gray-700">Date</th>
                  <th className="px-1 sm:px-3 py-2 text-right font-semibold text-gray-700">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map(tx => (
                  <P2PTransactionRow key={tx.id} transaction={tx} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function P2PTransactionRow({ transaction }: { transaction: P2PTransactionStyleProps }) {
  const isPaid = transaction.paymentModeP2P === "paid";
  const isReceived = transaction.paymentModeP2P === "received";

  let sign = "";
  let amountColor = "text-gray-800";
  let actionText = "Processing";

  if (isPaid) {
    sign = "-";
    amountColor = "text-red-600";
    actionText = "Sent";
  } else if (isReceived) {
    sign = "+";
    amountColor = "text-green-600";
    actionText = "Received";
  }

  const formattedAmount = Math.abs(transaction.amount / 100).toFixed(2);
  const formattedDate = transaction.time.toLocaleDateString();
  const formattedTime = transaction.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <tr className="bg-white hover:bg-gray-100 transition-colors text-[11px] sm:text-xs md:text-sm">
      <td className="px-1 sm:px-3 py-2 flex items-center gap-1 max-w-[8rem] sm:max-w-[12rem] truncate">
        {isPaid ? (
          <RiArrowRightUpLine className="h-4 w-4 text-red-500 shrink-0" />
        ) : isReceived ? (
          <RiArrowRightDownLine className="h-4 w-4 text-green-500 shrink-0" />
        ) : (
          <div className="h-4 w-4 rounded-full bg-gray-400 shrink-0" />
        )}
        <span className="text-gray-900 font-medium truncate">
          {transaction.toUserName}
        </span>
      </td>
      <td className="px-1 sm:px-3 py-2 text-gray-600 whitespace-nowrap font-semibold">
        {transaction.type || "-"}
      </td>
      <td className="px-1 sm:px-3 py-2 text-gray-600 whitespace-nowrap">
        {actionText}
      </td>
      <td className="px-1 sm:px-3 py-2 text-gray-600 whitespace-nowrap truncate font-semibold">
        {formattedDate} • {formattedTime}
      </td>
      <td className={`px-1 sm:px-3 py-2 text-right font-semibold ${amountColor} whitespace-nowrap font-bold`}>
        {isPaid ? `- ₹${formattedAmount}` : `${sign} ₹${formattedAmount}`}
      </td>
    </tr>
  );
}
