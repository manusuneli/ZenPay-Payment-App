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

export default function ParticipantList({
  participants,
  total,
}: {
  participants: SplitEntry[];
  total: number;
}) {
  return (
    <div className="border rounded-xl overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
        All Participants
      </div>
      <ul>
        {participants.map((p, i) => (
          <li
            key={i}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 py-3 border-t text-sm gap-2"
          >
            <div>
              <span className="font-semibold text-gray-800">{p.name}</span>
              <div className="text-xs text-gray-500">{p.email} | {p.phone}</div>
              {p.description && (
                <div className="text-xs italic text-gray-400">{p.description}</div>
              )}
            </div>
            <div className="text-right sm:text-left">
              <span className="font-semibold text-[#a259ff] block whitespace-nowrap">₹{(p.amount/100)}</span>
              <p className={`text-xs mt-1 ${p.status === "PENDING" ? "text-yellow-600" : "text-green-600"}`}>
                {p.status}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-between items-center px-4 py-3 bg-gray-50 text-sm font-semibold border-t">
        <span>Total</span>
        <span>₹{total}</span>
      </div>
    </div>
  );
}
