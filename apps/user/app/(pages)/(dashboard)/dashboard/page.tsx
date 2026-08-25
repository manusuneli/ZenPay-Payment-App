import React from "react";
import { getP2PTxns } from "../../../lib/actions/getP2P-txns";
import { getDepositeTxns } from "../../../lib/actions/getDeposite-txns";
import { getWithdrawTxns } from "../../../lib/actions/getWithdraw-txns";
import { getSplitDetails } from "../../../lib/actions/getSplitDetails";
import DashboardClient from "../../../../components/cards/Dashboard Cards/DashboardClient";

export default async function Dashboard() {
  const p2pData = await getP2PTxns();
  const DepositBankTransfers = await getDepositeTxns();
  const WithdrawBankTransfers = await getWithdrawTxns();
  const NumDepositBankTransfers = DepositBankTransfers.len || 0;
  const NumWithdrawBankTransfers = WithdrawBankTransfers.tx?.length || 0;
  const NumP2PTransfers = p2pData?.tx?.length || 0;
  
  const totalPaid = Number(p2pData?.totalPaid) || 0;
  const monthlySpendingVal = totalPaid / 100;
  const monthlySpending = `₹ ${monthlySpendingVal.toFixed(2)}`;

  const splitDetails = await getSplitDetails();
  const CountSplits = splitDetails.totalSplits || 0;
  const depositBankTx = DepositBankTransfers.tx;
  const withdrawBankTx = WithdrawBankTransfers.tx;

  const normalizedP2P = (p2pData?.tx || []).map((tx: any) => ({
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

  const normalizedDeposit = (depositBankTx || []).map((tx: any) => ({
    ...tx,
    type: "DEPOSIT",
    time: tx.time,
    title: tx.provider || "Bank",
    subtext: "Bank Deposit",
    direction: "credit",
    status: tx.status
  }));

  const normalizedWithdraw = (withdrawBankTx || []).map((tx: any) => ({
    ...tx,
    type: "WITHDRAW",
    time: tx.time,
    title: tx.provider || "Bank",
    subtext: "Bank Withdrawal",
    direction: "debit",
    status: tx.status
  }));

  const combinedTxns = [...normalizedP2P, ...normalizedDeposit, ...normalizedWithdraw]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 10);

  return (
    <DashboardClient
      monthlySpending={monthlySpending}
      NumDepositBankTransfers={NumDepositBankTransfers}
      NumWithdrawBankTransfers={NumWithdrawBankTransfers}
      NumP2PTransfers={NumP2PTransfers}
      CountSplits={CountSplits}
      combinedTxns={combinedTxns}
    />
  );
}