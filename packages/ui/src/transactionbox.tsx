export interface TransactionCardProps {
  id: number;
  amount: number;
  time: Date;
  accountNumber: string;
  status: string;
  provider: string;
}

export interface TransactionStyleProps {
  transaction: TransactionCardProps;
  typeOfPayment: "deposit" | "withdraw" | undefined;
  isMobile?: boolean;
}
export function TransactionStyle({
  transaction,
  typeOfPayment,
  isMobile = false,
}: TransactionStyleProps) {
  const statusColors: Record<string, string> = {
    Processing: "bg-amber-400",
    Success: "bg-green-400",
    Failure: "bg-red-400",
  };

  const dotColor = statusColors[transaction.status] ?? "bg-gray-300";

  const isProcessing = transaction.status === "Processing";

  const amountColor = isProcessing
    ? "text-gray-800"
    : typeOfPayment === "deposit"
      ? "text-green-600"
      : "text-red-600";

  const amountPrefix = isProcessing
    ? ""
    : typeOfPayment === "deposit"
      ? "+"
      : "-";

  // Don't round forcibly to 2 decimals if you want raw division
  const formattedAmount = (transaction.amount / 100);

  const formattedDate = transaction.time.toLocaleDateString();
  const formattedTime = transaction.time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isMobile) {
    return (
      <div className="rounded-lg border border-gray-200 p-4 shadow-sm bg-white flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`h-3 w-3 rounded-full ${dotColor}`} />
            <span className="text-sm font-medium text-gray-700">{transaction.status}</span>
          </div>
          <span className={`font-bold ${amountColor}`}>
            {amountPrefix} ₹{formattedAmount}
          </span>
        </div>
        <div className="text-sm text-gray-600">
          {typeOfPayment === "deposit" ? "Received" : "Sent"} via {transaction.provider}
        </div>
        <div className="text-xs text-gray-600 font-bold">
          Ac No.: {transaction.accountNumber}
        </div>
        <div className="text-xs text-gray-400">
          {formattedDate} • {formattedTime}
        </div>
      </div>
    );
  }

  return (
    <tr className="bg-white hover:bg-gray-50 transition-colors">
      <td className="px-3 py-2">
        <div className="flex items-center space-x-2">
          <span className={`h-3 w-3 rounded-full ${dotColor}`} />
          <span className="text-sm text-gray-700 font-semibold">{transaction.status}</span>
        </div>
      </td>
      <td className="px-3 py-2">
        <div className="text-sm text-gray-700">
          {typeOfPayment === "deposit" ? "Received" : "Sent"} via {transaction.provider}
        </div>
        <div className="text-xs text-gray-400">
          {formattedDate} • {formattedTime}
        </div>
      </td>
      <td className="px-3 py-2 text-sm text-gray-700 font-bold">{transaction.provider}</td>
      <td className="px-3 py-2 text-sm text-gray-700 font-bold">{transaction.accountNumber}</td>
      <td className={`px-3 py-2 text-right font-bold ${amountColor}`}>
        {amountPrefix} ₹{formattedAmount}
      </td>
    </tr>
  );
}
