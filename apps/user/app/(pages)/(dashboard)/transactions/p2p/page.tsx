import { getServerSession } from "next-auth";
import { prisma } from "@repo/db/client";
import { NEXT_AUTH } from "../../../../lib/auth";
import { P2PTxStyle } from "../../../../../components/cards/Pages Cards/p2pTxStyle";

async function getp2pTransactions() {
  const session = await getServerSession(NEXT_AUTH);
  const id = session?.user?.id;
  if (!id) return [];

  const txns = await prisma.p2pTransfer.findMany({
    where: { fromUserId: Number(id) },
    orderBy: {
      timestamp: "desc"
    }
  });

  return txns.map(t => ({
    id: t.id,
    time: t.timestamp,
    amount: t.amount,
    toUserId: t.toUserId,
    toUserName: t.toUserName,
    paymentModeP2P: t.paymentModeP2P,
    type: t.type
  }))
}

export default async function() {
  const transactions = await getp2pTransactions();

  return (
    <div className="w-full min-h-screen p-4">

      {transactions.length > 0 ? (
        <>
          <div className="text-center text-xl text-gray-700 mb-6 font-bold">
            {transactions.length} Transaction(s)
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 w-full">
            <P2PTxStyle transactions={transactions} />
          </div>
        </>
      ) : (
        <div className="font-semibold m-10 text-xl text-center">
          No Recent Transactions
        </div>
      )}
    </div>
  );
}
