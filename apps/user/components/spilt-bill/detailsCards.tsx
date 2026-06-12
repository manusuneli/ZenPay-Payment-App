

export interface SplitEntry {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  amount: number;
  description?: string | null;
  status: "PENDING" | "PROCESSING" | "SUCCESS" | "FAILURE" | "REJECTED";
}

export interface SplitDetails {
  createdAt: Date;
  description: string | null;
  totalAmount: number;
  splits: SplitEntry[];
  createdByUser: {
    name: string | null;
    number: string;
    email: string | null;
  };
}

export interface SplitBillApprovalProps {
  splitDetails?: SplitDetails;
  body: {
    token: string;
    splitId: number;
    splitBillId: number;
  };
}

export default function YourSplitDetail({ entry }: { entry: SplitEntry }) {
  return (
    <div className="p-5 border rounded-xl bg-[#f4edfa]">
      <h3 className="text-sm font-semibold mb-2 text-gray-700">Your Contribution</h3>
      <div className="text-sm text-gray-800 space-y-1">
        <div>
          <span className="font-medium">Amount:</span> ₹{(entry.amount)/100}
        </div>
        <div>
          <span className="font-medium">Status:</span> {entry.status}
        </div>
        {entry.description && (
          <div>
            <span className="font-medium">Description:</span> {entry.description}
          </div>
        )}
      </div>
    </div>
  );
}
