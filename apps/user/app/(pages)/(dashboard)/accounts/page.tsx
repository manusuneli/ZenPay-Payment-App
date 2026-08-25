import { prisma } from "@repo/db/client";
import { getServerSession } from "next-auth";
import { Lock, CreditCard, Plus } from "lucide-react";
import { NEXT_AUTH } from "../../../lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function MinimalCards() {
  const session = await getServerSession(NEXT_AUTH);
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }
  const userId = Number(session.user.id);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      accounts: {
        select: {
          accountNumber: true,
          id: true,
          ifsc: true,
        },
      },
    },
  });

  const cards = user?.accounts || [];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-14">
      {/* Header and Add button */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Saved Accounts</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your linked cards and bank accounts</p>
        </div>

        <Link href="/link-account">
          <button className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold shadow-sm shadow-purple-500/10 transition duration-200 flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            <span>Add Account</span>
          </button>
        </Link>
      </div>

      {cards.length === 0 ? (
        <div className="py-16 text-center flex flex-col items-center justify-center gap-3 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg mx-auto">
          <CreditCard className="w-10 h-10 text-slate-400" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No bank accounts linked yet</p>
          <p className="text-xs text-slate-500 max-w-xs">Link your bank account to start depositing and withdrawing funds instantly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => {
            const maskedAcc = `••••  ••••  ••••  ${card.accountNumber.slice(-4)}`;
            const gradients = [
              "from-purple-600 to-indigo-700",
              "from-pink-600 to-purple-600",
              "from-indigo-600 to-cyan-600",
            ];
            const activeGrad = gradients[index % gradients.length];

            return (
              <div
                key={card.id}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${activeGrad} text-white p-6 shadow-md shadow-indigo-500/10 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 select-none flex flex-col justify-between h-48`}
              >
                {/* Background blur circle */}
                <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />

                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-lg tracking-tight">ZenBank</h3>
                    <span className="text-[10px] uppercase font-bold text-white/70 tracking-widest">Debit Card</span>
                  </div>
                  <span className="bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider border border-white/10 uppercase">
                    IFSC: {card.ifsc}
                  </span>
                </div>

                <div className="text-lg font-mono tracking-widest font-bold my-4">
                  {maskedAcc}
                </div>

                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-white/60">Expires</span>
                    <span className="font-semibold text-[11px]">**/**</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <span className="block text-[8px] uppercase tracking-wider text-white/60">CVV</span>
                      <span className="font-semibold text-[11px] flex items-center gap-1">
                        *** <Lock className="w-3 h-3 text-green-300" />
                      </span>
                    </div>

                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/15">
                      <CreditCard className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
