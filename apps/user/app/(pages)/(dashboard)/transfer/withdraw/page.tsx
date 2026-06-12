import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "../../../../lib/auth";
import { prisma } from "@repo/db/client";
import { AddMoney } from "../../../../../components/cards/Pages Cards/AddMoneyCard";
import { BalanceCard } from "../../../../../components/cards/Pages Cards/BalanceCard";
import { TransactionCard } from "../../../../../components/transactions folder/Dashboard-Pages/TxnsRedirectingBox";

async function getBalance() {
  const session = await getServerSession(NEXT_AUTH);
  const id = session?.user?.id;
  if (id) {
    const balance = await prisma.balance.findFirst({
      where: {
        userId: Number(id)
      }
    });

    return {
      amount: balance?.amount || 0,
      locked: balance?.locked || 0
    };
  }
  return null;
}

async function getOnRampTransactions() {
  const session = await getServerSession(NEXT_AUTH);
  const id = session?.user?.id;
  if (id) {
    const txns = await prisma.onRampTransaction.findMany({
      where: {
        userId: Number(id)
      }
    });

    return txns.map(t => ({
      time: t.startTime,
      amount: t.amount,
      status: t.status,
      provider: t.provider
    }));
  }
  return null;
}


async function getAccounts() {
  const session = await getServerSession(NEXT_AUTH);
  const id = session?.user?.id;
  if (id) {
    const accounts = await prisma.account.findMany({
      where: { 
        userId: Number(id),
      },
      select: {
        accountNumber: true,
        ifsc: true
      }
    });
    return accounts.map(acc => ({
      bank: "ZenBank",
      accountNumber: acc.accountNumber,
      ifsc: acc.ifsc,
    }));
  }
  return [];
}


export default async function Page() {
  const balance = await getBalance();
  const txns = await getOnRampTransactions();
  const accounts = await getAccounts();
  return (
    <div className="flex justify-center px-2 sm:px-4 md:px-6 lg:px-10 py-4">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-4">

        <div className="bg-white w-full rounded-3xl p-2 lg:p-4 col-span-1 lg:col-span-7">
          <AddMoney title="Withdraw" buttonThing="Withdraw Money" accounts={accounts}/>
        </div>

        <div className="w-full col-span-1 lg:col-span-5 flex flex-col space-y-4">

          <div className="bg-white w-full rounded-3xl p-4">
            <BalanceCard
              amount={balance ? balance.amount : 0}
              locked={balance ? balance.locked : 0}
            />
          </div>

          <div className="bg-white w-full rounded-3xl p-4">
            <TransactionCard
              transactions={txns ? txns : []}
              href="/transactions/withdraw"
            />
          </div>

        </div>

      </div>
    </div>
  );
}
