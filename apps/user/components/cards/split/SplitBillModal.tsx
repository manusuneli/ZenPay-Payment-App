"use client";

import React, { useState, useMemo, useEffect } from "react";
import { X, Plus, Loader2, Users, Search, DollarSign, ListTodo, ShieldAlert, ArrowRight } from "lucide-react";
import { getContacts } from "../../../app/lib/actions/getContacts";
import { CreateSplit } from "../../../app/lib/actions/createSplit";
import { useToast } from "../../../providers/ToastProvider";

interface Contact {
  contactId: number;
  contactName: string;
  contactEmail: string;
  contactNumber: string;
}

interface SplitItem {
  userId: number;
  name: string;
  email: string;
  phoneNumber: string;
  amount: number;
  description: string;
  paid: boolean;
}

interface SplitModalProps {
  setAmount: (a: number) => void;
  onClose: () => void;
  onCreateSplit: (group: SplitItem[], creatorDescription: string) => void;
}

export function SplitBillModal({
  setAmount,
  onClose,
  onCreateSplit,
}: SplitModalProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [extraContacts, setExtraContacts] = useState<string[]>([]);
  const [phoneInput, setPhoneInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [customDist, setCustomDist] = useState<Record<string, number>>({});
  const [splitDescriptions, setSplitDescriptions] = useState<Record<string, string>>({});
  const [totalAmt, setTotalAmt] = useState(0);
  const [mode, setMode] = useState<"equal" | "custom">("equal");
  const [useGlobalDesc, setUseGlobalDesc] = useState(false);
  const [globalDesc, setGlobalDesc] = useState("");
  const [creatorDescription, setCreatorDescription] = useState("");

  const [loadingContacts, setLoadingContacts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    async function fetchContacts() {
      try {
        setLoadingContacts(true);
        const res = await getContacts();
        const AllMyContacts = res?.AllMyContacts ?? [];
        setContacts(AllMyContacts);
      } catch (err) {
        console.error("Failed to fetch contacts", err);
        showToast("Failed to retrieve contacts.", "error");
      } finally {
        setLoadingContacts(false);
      }
    }
    fetchContacts();
  }, [showToast]);

  const allContacts = useMemo(() => {
    const base = contacts.map((c) => ({
      id: c.contactId,
      userId: c.contactId,
      name: c.contactName,
      email: c.contactEmail,
      phone: c.contactNumber,
    }));

    const extras = extraContacts.map((num, idx) => ({
      id: `e${idx}`,
      userId: 0,
      name: `Extra ${num}`,
      email: "-",
      phone: num,
    }));

    return [...base, ...extras].filter((c) =>
      `${c.name} ${c.email} ${c.phone}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [contacts, extraContacts, searchTerm]);

  const selectedContacts = useMemo(() => {
    return allContacts.filter((c) => selectedIds.has(c.id));
  }, [allContacts, selectedIds]);

  const equalAmount = selectedContacts.length > 0 ? +(totalAmt / selectedContacts.length).toFixed(2) : 0;

  const totalWeight = useMemo(() => {
    return selectedContacts.reduce((sum, c) => sum + (customDist[c.id] || 0), 0);
  }, [selectedContacts, customDist]);

  const calculateAmount = (id: string | number) => {
    const weight = customDist[id] || 0;
    if (mode === "equal") return equalAmount;
    if (totalWeight === 0) return 0;
    return +((weight / totalWeight) * totalAmt).toFixed(2);
  };

  const confirmSplit = async () => {
    const splitItems: SplitItem[] = selectedContacts.map((c) => ({
      userId: c.userId,
      name: c.name,
      email: c.email,
      phoneNumber: c.phone,
      amount: calculateAmount(c.id),
      description: useGlobalDesc ? globalDesc : splitDescriptions[c.id] || "",
      paid: false,
    }));

    if (!splitItems.length) {
      showToast("Please select at least one contact to split with.", "error");
      return;
    }

    if (splitItems.some((s) => s.amount <= 0)) {
      showToast("Ensure split amounts are greater than zero.", "error");
      return;
    }

    try {
      setSubmitting(true);
      const res = await CreateSplit(splitItems, totalAmt * 100, creatorDescription);
      showToast(res?.msg || "Split created successfully", "success");
      onCreateSplit(splitItems, creatorDescription);
      onClose();
    } catch (error) {
      console.error("Split creation failed", error);
      showToast("Failed to create split.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const addExtra = () => {
    const phone = phoneInput.trim();
    if (phone && !extraContacts.includes(phone)) {
      setExtraContacts((p) => [...p, phone]);
      setPhoneInput("");
    } else if (!phone) {
      showToast("Enter a valid phone number", "error");
    }
  };

  const toggleSelection = (id: string | number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1a1a2e] p-6 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto space-y-6 relative border border-slate-100 dark:border-slate-800 shadow-2xl transition-colors duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span>Create Expense Split</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Configure your split parameters and select members</p>
        </div>

        {/* Configurations grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">Split Mode</label>
            <select 
              value={mode} 
              onChange={(e) => setMode(e.target.value as any)} 
              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0f0f1a] border border-slate-200 dark:border-slate-850 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
            >
              <option value="equal">Equal Shares</option>
              <option value="custom">Custom Weights</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">Global Description</label>
            <div className="relative flex items-center">
              <input 
                type="checkbox" 
                checked={useGlobalDesc} 
                onChange={(e) => setUseGlobalDesc(e.target.checked)} 
                className="mr-3 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <input
                type="text"
                disabled={!useGlobalDesc}
                value={globalDesc}
                onChange={(e) => setGlobalDesc(e.target.value)}
                placeholder="e.g. Dinner split, Uber ride"
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-[#0f0f1a] disabled:opacity-60 border border-slate-200 dark:border-slate-850 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
              />
            </div>
          </div>
        </div>

        {/* Amounts and details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Total Bill Amount</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm">₹</span>
              <input
                type="number"
                value={totalAmt === 0 ? "" : totalAmt}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setTotalAmt(val);
                  setAmount(val);
                }}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-[#0f0f1a] border border-slate-200 dark:border-slate-850 rounded-xl text-sm font-bold text-slate-850 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Your share Description</label>
            <div className="relative">
              <input
                type="text"
                value={creatorDescription}
                onChange={(e) => setCreatorDescription(e.target.value)}
                placeholder="e.g. Paid for Dinner"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#0f0f1a] border border-slate-200 dark:border-slate-850 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
              />
            </div>
          </div>
        </div>

        {/* Searching & Add Extra */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-8 space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Search Contacts</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email or phone..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#0f0f1a] border border-slate-200 dark:border-slate-850 rounded-xl text-sm font-medium text-slate-850 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
              />
            </div>
          </div>

          <div className="md:col-span-4 space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Add Unlisted Contact</label>
            <div className="flex gap-2">
              <input
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ""))}
                placeholder="10 digit phone"
                maxLength={10}
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-[#0f0f1a] border border-slate-200 dark:border-slate-850 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2"
              />
              <button 
                onClick={addExtra} 
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Contacts selection table */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Member List</h3>
          
          <div className="border border-slate-100 dark:border-slate-850 rounded-2xl overflow-hidden max-h-48 overflow-y-auto">
            {loadingContacts ? (
              <div className="py-12 flex justify-center items-center">
                <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/40 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-850">
                    <th className="px-4 py-2.5 text-center w-12">Select</th>
                    <th className="px-4 py-2.5">Name</th>
                    <th className="px-4 py-2.5">Email</th>
                    <th className="px-4 py-2.5">Phone</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-slate-700 dark:text-slate-300">
                  {allContacts.map((c) => {
                    const isChecked = selectedIds.has(c.id);
                    return (
                      <tr 
                        key={c.id} 
                        onClick={() => toggleSelection(c.id)}
                        className={`cursor-pointer hover:bg-purple-50/20 dark:hover:bg-purple-950/10 transition ${
                          isChecked ? "bg-purple-50/40 dark:bg-purple-950/20" : ""
                        }`}
                      >
                        <td className="px-4 py-2.5 text-center" onClick={(e) => e.stopPropagation()}>
                          <input 
                            type="checkbox" 
                            checked={isChecked} 
                            onChange={() => toggleSelection(c.id)}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-3.5 w-3.5"
                          />
                        </td>
                        <td className="px-4 py-2.5 font-semibold">{c.name}</td>
                        <td className="px-4 py-2.5">{c.email}</td>
                        <td className="px-4 py-2.5 font-mono">{c.phone}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Selected contacts breakdown */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Bill Split Breakdown</h3>
          
          {selectedContacts.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500 border border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
              No members selected yet.
            </div>
          ) : (
            <div className="border border-slate-100 dark:border-slate-850 rounded-2xl overflow-hidden max-h-48 overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/40 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-850">
                    <th className="px-4 py-2.5">Name</th>
                    <th className="px-4 py-2.5">Phone</th>
                    {mode === "custom" && <th className="px-4 py-2.5 w-24">Weight</th>}
                    <th className="px-4 py-2.5">Share Amount</th>
                    {!useGlobalDesc && <th className="px-4 py-2.5">Individual Description</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-slate-700 dark:text-slate-300">
                  {selectedContacts.map((c) => (
                    <tr key={c.id}>
                      <td className="px-4 py-2.5 font-semibold">{c.name}</td>
                      <td className="px-4 py-2.5 font-mono">{c.phone}</td>
                      {mode === "custom" && (
                        <td className="px-4 py-2" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="number"
                            value={customDist[c.id] ?? ""}
                            onChange={(e) =>
                              setCustomDist((prev) => ({ ...prev, [c.id]: Number(e.target.value) }))
                            }
                            className="w-16 px-2 py-1 bg-slate-50 dark:bg-[#0f0f1a] border border-slate-200 dark:border-slate-850 rounded-lg focus:outline-none"
                          />
                        </td>
                      )}
                      <td className="px-4 py-2.5 font-bold text-purple-600 dark:text-purple-400">₹{calculateAmount(c.id).toFixed(2)}</td>
                      {!useGlobalDesc && (
                        <td className="px-4 py-2" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={splitDescriptions[c.id] ?? ""}
                            onChange={(e) =>
                              setSplitDescriptions((prev) => ({ ...prev, [c.id]: e.target.value }))
                            }
                            placeholder="Share description"
                            className="w-full px-2 py-1 bg-slate-50 dark:bg-[#0f0f1a] border border-slate-200 dark:border-slate-850 rounded-lg text-xs focus:outline-none"
                          />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer row */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Grand Total</span>
            <p className="text-lg font-black text-slate-850 dark:text-slate-100 mt-0.5">₹{totalAmt.toFixed(2)}</p>
          </div>

          <button
            onClick={confirmSplit}
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center justify-center gap-1.5 transition duration-200 shadow-md shadow-purple-500/10"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
              </>
            ) : (
              <>
                <span>Confirm Split</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
