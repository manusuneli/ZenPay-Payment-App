import React from "react";
import { FaUserFriends, FaGift, FaChartLine } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { getP2PTxns } from "../../../lib/actions/getP2P-txns";
import { ActionCard, MainCardDashboard } from "../../../../components/cards/Dashboard Cards/clientSideDashboard";
import { getDepositeTxns } from "../../../lib/actions/getDeposite-txns";
import { FaArrowsDownToLine, FaArrowsUpToLine } from "react-icons/fa6";
import { ButtonDashboardActionCard } from "../../../../components/buttons/buttonsDashboardActionCards";
import { getSplitDetails } from "../../../lib/actions/getSplitDetails";
import { RiP2pFill, RiBillFill } from "react-icons/ri";
import { RiArrowRightUpLine, RiArrowRightDownLine } from "react-icons/ri";
import { getWithdrawTxns } from "../../../lib/actions/getWithdraw-txns";

// async function getP2PTransactions() {
//   const session = await getServerSession(NEXT_AUTH);
//   const userId = session?.user?.id;
//   if (!userId) return [];
//   const txns = await prisma.p2pTransfer.findMany({
//     where: { fromUserId: Number(userId) },
//     orderBy: { timestamp: 'desc' },
//   });
//   return txns.map(t => ({
//     id: t.id,
//     date: t.timestamp.toISOString(),
//     amount: t.amount,
//     description: t.paymentModeP2P,
//     toUserName: t.toUserName,
//   }));
// }

export default async function Dashboard() {
  const p2pData = await getP2PTxns();
  const DepositBankTransfers = await getDepositeTxns();
  const WithdrawBankTransfers = await getWithdrawTxns();
  const NumDepositBankTransfers = (DepositBankTransfers).len;
  const NumWithdrawBankTransfers = WithdrawBankTransfers.tx?.length;
  const NumP2PTransfers = p2pData?.tx?.length || 0
  const monthlySpending = Number(p2pData?.totalPaid)/100 || '0.00';
  const splitDetails = await getSplitDetails();
  const CountSplits = splitDetails.totalSplits;
  const depositBankTx = DepositBankTransfers.tx;
  const withdrawBankTx = WithdrawBankTransfers.tx;

  // const friends = p2pData.friends || 0;
  // const currency = p2pData.currency || "₹";
  const normalizedP2P = (p2pData?.tx || []).map(tx => ({
    ...tx,
    type: tx.type || "P2P",
    time: tx.time,
    title: tx.toUserName || "Unknown",
    subtext:
      tx.type === "SPLIT"
        ? "Bill Split"
        : tx.paymentModeP2P === "paid"
        ? "Sent via P2P"
        : "Received via P2P",
    direction:
      tx.paymentModeP2P === "paid" || tx.amount < 0 ? "debit" : "credit",
    status: "Success"
  }));

  const normalizedDeposit = (depositBankTx || []).map(tx => ({
    ...tx,
    type: "DEPOSIT",
    time: tx.time,
    title: tx.provider || "Bank",
    subtext: "Bank Deposit",
    direction: "credit",
    status: tx.status
  }));

  const normalizedWithdraw = (withdrawBankTx || []).map(tx => ({
    ...tx,
    type: "WITHDRAW",
    time: tx.time,
    title: tx.provider || "Bank",
    subtext: "Bank Withdrawal",
    direction: "debit",
    status: tx.status
  }));

  // Merge and sort by time
  const combinedTxns = [...normalizedP2P, ...normalizedDeposit, ...normalizedWithdraw]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-pink-50 p-6">
      <h1 className="mt-14 text-3xl ml-20 sm:text-4xl bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 inline-block text-transparent bg-clip-text font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        
        <MainCardDashboard></MainCardDashboard>
        <div className="bg-white rounded-3xl p-6 shadow-md border border-indigo-100">
          <h3 className="text-xl font-semibold mb-5 text-indigo-700">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-5">
            <ActionCard
              icon={<GrTransaction size={26} className="text-indigo-600" />}
              label="Send Money"
              to="/p2p"
            />
            <ActionCard
              icon={<FaArrowsUpToLine size={26} className="text-indigo-600" />}
              label="Withdraw Money"
              to="/transfer/withdraw"
            />
            <ActionCard
              icon={<FaUserFriends size={26} className="text-indigo-600" />}
              label="Accounts"
              to="/accounts"
            />
            <ActionCard
              icon={<FaGift size={26} className="text-indigo-600" />}
              label="Split Bill"
              to="/split-bill"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <ButtonDashboardActionCard c={<FaChartLine className="text-indigo-600" />} to="/transactions/p2p" Num={`₹ ${monthlySpending}`}>Total Spent</ButtonDashboardActionCard>
        <ButtonDashboardActionCard c={<FaUserFriends className="text-indigo-600" />} to="/transactions/p2p" Num={0}>Friends Paid</ButtonDashboardActionCard>
        <ButtonDashboardActionCard c={<FaArrowsDownToLine className="text-indigo-600" />} to="/transactions/deposit" Num={NumDepositBankTransfers || 0}>Deposits Bank Transfers</ButtonDashboardActionCard>
        <ButtonDashboardActionCard c={<FaArrowsUpToLine className="text-indigo-600" />} to="/transactions/withdraw" Num={NumWithdrawBankTransfers || 0}>Withdrew Bank Transfers</ButtonDashboardActionCard>
        <ButtonDashboardActionCard c={<RiP2pFill className="text-indigo-600" size={18} />} to="/transactions/p2p" Num={NumP2PTransfers}>P2P Transfers</ButtonDashboardActionCard>
        <ButtonDashboardActionCard c={<RiBillFill className="text-indigo-600" size={18}/>} to="/split-bill" Num={Number(CountSplits) || 0}>Bills Split</ButtonDashboardActionCard>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md border border-indigo-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-indigo-700">Recent Transactions</h3>
          <a href="/transactions/deposit" className="text-indigo-600 hover:underline">
            View All
          </a>
        </div>
        <ul className="space-y-4">
          {combinedTxns.map((txn, idx) => (
            <li key={idx} className="flex items-center justify-between border-b pb-1">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-full ${
                    txn.type === "P2P"
                      ? "bg-white"
                      : txn.type === "SPLIT"
                      ? "bg-purple-50"
                      : txn.type === "DEPOSIT"
                      ? "bg-white"
                      : "bg-white"
                  }`}
                >
                  {txn.status === "Processing" ? <div>
                    {txn.type === "P2P" && txn.direction==="credit"? (
                      <RiArrowRightDownLine className="text-black" size={20} />
                    ) : txn.type === "P2P" && txn.direction==="debit"? (
                      
                      <RiArrowRightUpLine className="text-black" size={20} />
                    ) : txn.type === "SPLIT" ? (
                      <RiBillFill className="text-black" />
                    ) : txn.type === "DEPOSIT" ? (
                      <RiArrowRightDownLine className="text-black" size={20}/>
                    ) : (
                      <RiArrowRightUpLine className="text-black" size={20}/>
                    )}
                  </div> : <div>
                    {txn.type === "P2P" && txn.direction==="credit"? (
                    <RiArrowRightDownLine className="text-green-600" size={20} />
                    ) : txn.type === "P2P" && txn.direction==="debit"? (
                      
                      <RiArrowRightUpLine className="text-red-600" size={20} />
                    ) : txn.type === "SPLIT" ? (
                      <RiBillFill className="text-purple-600" />
                    ) : txn.type === "DEPOSIT" ? (
                      <RiArrowRightDownLine className="text-green-600" size={20}/>
                    ) : (
                      <RiArrowRightUpLine className="text-red-600" size={20}/>
                    )}
                    </div>}
                  
                </div>
                <div>
                  <p className="font-medium text-gray-800 font-bold">{txn.title}</p>
                  <p className="text-xs text-gray-500 font-semibold">{txn.subtext}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(txn.time).toLocaleDateString()}{" "}
                    {new Date(txn.time).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              {txn.status === "Processing" ? <div>
                <div
                  className={`font-semibold ${
                    txn.direction === "debit" ? "text-black" : "text-black"
                  }`}
                >
                  ₹{" "}
                  {Math.abs(txn.amount / 100).toFixed(2)}
                </div>
              </div> : <div>
                <div
                  className={`font-semibold ${
                    txn.direction === "debit" ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {txn.direction === "debit" ? "-" : "+"} ₹{" "}
                  {Math.abs(txn.amount / 100).toFixed(2)}
                </div>
                </div>}
              
            </li>
          ))}
          {combinedTxns.length === 0 && (
            <li className="text-center text-gray-400">No recent transactions</li>
          )}
        </ul>


      </div>
    </div>
  );
}