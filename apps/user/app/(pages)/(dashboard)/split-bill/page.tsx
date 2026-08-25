import { SplitBillTabs } from "../../../../components/cards/split/splitBillTab";
import { SplitBillCards } from "../../../../components/cards/split/splitCard";
import { getSplitDetails } from "../../../lib/actions/getSplitDetails";


export type Tab = "All" | "Pending" | "Completed";

export interface SplitItem {
  userId: number;
  name: string;
  status: "PENDING" | "REJECTED" | "FAILURE" | "SUCCESS" | "PROCESSING";
  email: string;
  phoneNumber: string;
  amount: number;
  description: string;
  paid: boolean;
}

export interface SplitBillPageData {
  paymentsPending: string;
  pendingCredits: string;
  totalSplits: string;
  activeSplits: string;
  allSplits: SplitItem[][];
}

export default async function SplitBillPage() {
  const {
    paymentsPending,
    pendingCredits,
    totalSplits,
    activeSplits,
    allSplits
  } = await getSplitDetails();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-14">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Bills Split</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage and share expenses easily with friends</p>
      </div>

      <div className="space-y-6">
        <SplitBillCards
          paymentsPending={(paymentsPending || 0)/100}
          pendingCredits={(pendingCredits || 0)/100}
          totalSplits={totalSplits || 0}
          activeSplits={activeSplits || 0}
        />
        <SplitBillTabs allSplits={allSplits} />
      </div>
    </div>
  );
}
