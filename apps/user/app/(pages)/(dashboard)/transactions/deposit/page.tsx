import { getServerSession } from "next-auth";

import { prisma } from "@repo/db/client";
import { NEXT_AUTH } from "../../../../lib/auth";
import { TransactionStyle } from "@repo/ui/transactionbox";



async function getOnRampTransactions()
{
    const session = await getServerSession(NEXT_AUTH);
    const id = session?.user?.id;
    if(id)
    {
        // console.log("HERE");
        const txns = await prisma.onRampTransaction.findMany({
            where: {
              userId: Number(id)
            },
            orderBy: {
              startTime: "desc"
            }
        })
    
        // console.log(txns);
        var txs = txns.map(t => ({
            id: t.id,
            time: t.startTime,
            amount: t.amount,
            accountNumber: t.accountNumber,
            status: t.status,
            provider: t.provider
        }))
        return txs;
    }
    return null;
}
export default async function Page() {
  const transactions = await getOnRampTransactions();

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4">
        <h1 className="text-center text-2xl sm:text-3xl font-bold text-purple-700 mb-6">
        Recent Deposit Transactions
      </h1>
      {transactions && transactions.length > 0 ? (
        <>
          <div className="text-center text-lg font-medium text-gray-700 mb-4">
            {transactions.length} Transaction(s)
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
            <TxnsPage transactions={transactions} typeofPayment="deposit" />
          </div>
        </>
      ) : (
        <div className="text-center font-semibold text-gray-600 py-12">
          No Recent Transactions
        </div>
      )}
    </div>
  );
}

interface TransactionCardProps {
  id: number;
  amount: number;
  time: Date;
  accountNumber: string;
  status: string;
  provider: string;
}
export function TxnsPage({
  transactions,
  typeofPayment,
}: {
  transactions: TransactionCardProps[];
  typeofPayment?: "deposit" | "withdraw";
}) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center font-semibold py-8 text-gray-600">
        No Recent Transactions
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="hidden sm:table w-full border-collapse text-sm md:text-base">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Details</th>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Provider</th>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Account Number</th>
            <th className="px-4 py-2 text-right font-medium text-gray-700">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {transactions.map(tx => (
            <TransactionStyle
              key={tx.id}
              transaction={tx}
              typeOfPayment={typeofPayment}
            />
          ))}
        </tbody>
      </table>

      <div className="flex flex-col space-y-3 sm:hidden w-full">
        {transactions.map(tx => (
          <TransactionStyle
            key={tx.id}
            transaction={tx}
            typeOfPayment={typeofPayment}
            isMobile
          />
        ))}
      </div>
    </div>
  );
}
