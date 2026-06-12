"use client";

import { useMemo, useState } from "react";
import { SplitItem, Tab } from "../../../app/(pages)/(dashboard)/split-bill/page";
import { SplitBillList } from "./splitBillList";
import { SplitBillModal } from "./SplitBillModal";
import { BsPlusLg } from "react-icons/bs";

export function SplitBillTabs({
  allSplits,
}: {
  allSplits?: SplitItem[][];
}) {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [splitSearch, setSplitSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [totalAmt, setTotalAmt] = useState(0);

  const filteredSplits = useMemo(() => {
    return allSplits?.filter(group => {
      const first = group[0];
      const descMatch = first?.description.toLowerCase().includes(splitSearch.toLowerCase());
      const phoneMatch = group.some(i => i.phoneNumber.includes(splitSearch));
      const statusMatch =
        activeTab === "All"
          ? true
          : activeTab === "Pending"
          ? group.some(i => !i.paid)
          : group.every(i => i.paid);
      return (descMatch || phoneMatch) && statusMatch;
    });
  }, [allSplits, splitSearch, activeTab]);

  return (
    <>
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#6e3cbc] hover:bg-[#593397] text-white px-6 py-3 rounded-lg flex items-center space-x-2 shadow-md"
        >
          <BsPlusLg className="text-lg" />
          <span>Create Split</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <div className="flex items-center space-x-3">
          {(["All", "Pending", "Completed"] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1 rounded-full text-sm font-medium shadow-sm border ${
                activeTab === tab ? "bg-[#6e3cbc] text-white" : "text-gray-700 bg-white hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search splits..."
          value={splitSearch}
          onChange={e => setSplitSearch(e.target.value)}
          className="border rounded-md px-3 py-2 w-full sm:w-64 focus:ring-2 focus:ring-[#6e3cbc]"
        />
      </div>

      <SplitBillList splits={filteredSplits} />

      {showForm && (
        <SplitBillModal
          setAmount={setTotalAmt}
          onClose={() => setShowForm(false)}
          onCreateSplit={(newGroup, desc) => {
            alert("Split created: " + desc);
            setShowForm(false);
          }}
        />
      )}
    </>
  );
}
