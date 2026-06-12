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
    <div className="flex-auto mx-10">
      <h1 className="mt-20 text-4xl ml-20 sm:text-4xl bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 inline-block text-transparent bg-clip-text font-bold mb-6">
        Bills Split
      </h1>
      <h5 className="text-md ml-10 sm:text-2xl bg-purple-700 bg-clip-text text-transparent font-bold mb-6">
        Manage shared expenses
      </h5>

      <div className="mb-4 px-8 py-6 bg-white min-h-screen lg:mx-auto rounded-3xl">
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
