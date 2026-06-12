"use client";
import React, { useState, useMemo, useEffect } from "react";
import { FaTimes, FaPlus, FaSpinner } from "react-icons/fa";
import { getContacts } from "../../../app/lib/actions/getContacts";
import { CreateSplit } from "../../../app/lib/actions/createSplit";

const themeAccent = "text-[#6e3cbc]";
const themeBtn = "bg-[#6e3cbc] hover:bg-[#593397] text-white";

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

  // Loader states
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchContacts() {
      try {
        setLoadingContacts(true);
        const res = await getContacts();
        const AllMyContacts = res?.AllMyContacts ?? [];
        setContacts(AllMyContacts);
      } catch (err) {
        console.error("Failed to fetch contacts", err);
      } finally {
        setLoadingContacts(false);
      }
    }
    fetchContacts();
  }, []);

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

    if (!splitItems.length || splitItems.some((s) => s.amount <= 0)) {
      alert("Ensure valid selections and amounts.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await CreateSplit(splitItems, totalAmt, creatorDescription);
      alert(res.msg);
      onCreateSplit(splitItems, creatorDescription);
      onClose();
    } catch (error) {
      console.error("Split creation failed", error);
      alert("Failed to create split.");
    } finally {
      setSubmitting(false);
    }
  };

  const addExtra = () => {
    const phone = phoneInput.trim();
    if (phone && !extraContacts.includes(phone)) {
      setExtraContacts((p) => [...p, phone]);
      setPhoneInput("");
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
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto space-y-6 relative">
        {/* Loader overlay while loading contacts */}
        {loadingContacts && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-2xl">
            <FaSpinner className="animate-spin text-3xl text-gray-500" />
          </div>
        )}

        <FaTimes className="absolute top-4 right-4 cursor-pointer" onClick={onClose} />
        <h2 className={`text-2xl font-bold ${themeAccent}`}>Split Bill</h2>

        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm">Split Mode</label>
            <select value={mode} onChange={(e) => setMode(e.target.value as any)} className="border rounded-md px-2 py-1">
              <option value="equal">Equal</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={useGlobalDesc} onChange={(e) => setUseGlobalDesc(e.target.checked)} />
            <label className="text-sm">Global Description</label>
          </div>
          {useGlobalDesc && (
            <input
              type="text"
              value={globalDesc}
              onChange={(e) => setGlobalDesc(e.target.value)}
              placeholder="Shared description"
              className="flex-1 border rounded-md px-3 py-1"
            />
          )}
        </div>

        <div>
          <label className="block mb-1">Total Amount</label>
          <input
            type="number"
            value={totalAmt === 0 ? "" : totalAmt}
            onChange={(e) => {
              const raw = e.target.value;
              const cleaned = raw.replace(/^0+(?=\d)/, "");
              const val = Number(cleaned || "0");
              setTotalAmt(val);
              setAmount(val);
            }}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>


        <div>
          <label className="block mb-1">Your Description</label>
          <input
            type="text"
            value={creatorDescription}
            onChange={(e) => setCreatorDescription(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1">
            <label className="block mb-1">Search Contacts</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name, phone, email"
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1">Add Extra</label>
            <div className="flex gap-2">
              <input
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="Phone number"
                className="border rounded-md px-3 py-2"
              />
              <button onClick={addExtra} className="px-4 py-2 border rounded-md">
                <FaPlus />
              </button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">All Contacts</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border rounded-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Select</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Phone</th>
                </tr>
              </thead>
              <tbody>
                {allContacts.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="p-2">
                      <input type="checkbox" checked={selectedIds.has(c.id)} onChange={() => toggleSelection(c.id)} />
                    </td>
                    <td className="p-2">{c.name}</td>
                    <td className="p-2">{c.email}</td>
                    <td className="p-2">{c.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mt-6 mb-2">Split Details</h3>
          {selectedContacts.length === 0 ? (
            <div className="text-center text-gray-500 py-8 text-sm border rounded-md">No splits yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border rounded-md">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Phone</th>
                    {mode === "custom" && <th className="p-2 text-left">Weight</th>}
                    <th className="p-2 text-left">Amount</th>
                    {!useGlobalDesc && <th className="p-2 text-left">Description</th>}
                  </tr>
                </thead>
                <tbody>
                  {selectedContacts.map((c) => (
                    <tr key={c.id} className="border-t">
                      <td className="p-2">{c.name}</td>
                      <td className="p-2">{c.phone}</td>
                      {mode === "custom" && (
                        <td className="p-2">
                          <input
                            type="number"
                            value={customDist[c.id] ?? ""}
                            onChange={(e) =>
                              setCustomDist((prev) => ({ ...prev, [c.id]: Number(e.target.value) }))
                            }
                            className="w-20 border rounded-md px-2 py-1"
                          />
                        </td>
                      )}
                      <td className="p-2">₹{calculateAmount(c.id).toFixed(2)}</td>
                      {!useGlobalDesc && (
                        <td className="p-2">
                          <input
                            type="text"
                            value={splitDescriptions[c.id] ?? ""}
                            onChange={(e) =>
                              setSplitDescriptions((prev) => ({ ...prev, [c.id]: e.target.value }))
                            }
                            className="w-full border rounded-md px-2 py-1"
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

        <div className="flex justify-between items-center pt-4">
          <p className="text-lg font-semibold">Grand Total:</p>
          <p className="text-lg font-bold">₹{totalAmt.toFixed(2)}</p>
        </div>

        <button
          onClick={confirmSplit}
          className={`${themeBtn} w-full py-2 rounded-md flex items-center justify-center gap-2`}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <FaSpinner className="animate-spin" /> Submitting...
            </>
          ) : (
            "Confirm Split"
          )}
        </button>
      </div>
    </div>
  );
}
