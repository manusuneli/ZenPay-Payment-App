"use client";

import { useMemo, useState } from "react";
import { SplitItem, Tab } from "../../../app/(pages)/(dashboard)/split-bill/page";
import { SplitBillList } from "./splitBillList";
import { SplitBillModal } from "./SplitBillModal";
import { Plus, Search } from "lucide-react";
import { useToast } from "../../../providers/ToastProvider";

export function SplitBillTabs({
  allSplits,
}: {
  allSplits?: SplitItem[][];
}) {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [splitSearch, setSplitSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [totalAmt, setTotalAmt] = useState(0);
  
  const { showToast } = useToast();

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
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl flex items-center gap-1.5 shadow-sm font-semibold transition duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Split</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        {/* Tab pills */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700/30 w-full sm:w-auto">
          {(["All", "Pending", "Completed"] as Tab[]).map(tab => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition duration-200 ${
                  isActive 
                    ? "bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-450 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search splits..."
            value={splitSearch}
            onChange={e => setSplitSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-[#0f0f1a] border border-slate-200 dark:border-slate-850 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 dark:focus:border-purple-500 transition duration-200"
          />
        </div>
      </div>

      <SplitBillList splits={filteredSplits} />

      {showForm && (
        <SplitBillModal
          setAmount={setTotalAmt}
          onClose={() => setShowForm(false)}
          onCreateSplit={(newGroup, desc) => {
            showToast("Bill split created successfully!", "success");
            setShowForm(false);
          }}
        />
      )}
    </>
  );
}
