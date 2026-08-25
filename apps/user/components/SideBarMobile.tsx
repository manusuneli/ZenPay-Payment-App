"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Home, ArrowLeftRight, Users, CreditCard, User, ShieldCheck, History, FileText, Bell, Menu, X } from "lucide-react";
import SideBarItems from "@repo/ui/sidebaritems";

export default function SideBarMobile({ type }: { type: "Profile" | "Dashboard" }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  const hideSidebar = () => setIsSidebarOpen(false);

  // Close sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  if (type !== "Dashboard") return null;

  const userDetails = {
    name: session?.user?.name || "User",
    email: session?.user?.email || ""
  };

  const initials = userDetails.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div>
      {/* Hamburger Menu Trigger */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        type="button"
        className="fixed top-16 left-4 z-40 p-2.5 rounded-xl shadow-md bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 transition duration-200 lg:hidden"
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Drawer Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Drawer Navigation */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-50 w-72 max-w-[85vw] h-screen transform transition-transform duration-300 ease-in-out bg-white dark:bg-[#0d0d1a] border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between py-6 px-4 lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-8 px-4 pt-2">
            <span className="font-extrabold text-2xl text-purple-600 dark:text-purple-400">ZenPay</span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-12rem)]">
            <SideBarItems setClickFunc={hideSidebar} href="/dashboard" icon={<Home className="w-5 h-5" />} title="Home" />
            <SideBarItems setClickFunc={hideSidebar} href="/transfer/deposit" icon={<ArrowLeftRight className="w-5 h-5" />} title="Transfer" />
            <SideBarItems setClickFunc={hideSidebar} href="/p2p" icon={<Users className="w-5 h-5" />} title="P2P Transfer" />
            <SideBarItems setClickFunc={hideSidebar} href="/split-bill" icon={<FileText className="w-5 h-5" />} title="Bills Split" />
            <SideBarItems setClickFunc={hideSidebar} href="/notificationsnpendings" icon={<Bell className="w-5 h-5" />} title="Notifications" />
            <SideBarItems setClickFunc={hideSidebar} href="/transactions/deposit" icon={<History className="w-5 h-5" />} title="Transactions" />
            <SideBarItems setClickFunc={hideSidebar} href="/accounts" icon={<CreditCard className="w-5 h-5" />} title="Cards" />
            <SideBarItems setClickFunc={hideSidebar} href="/profile" icon={<User className="w-5 h-5" />} title="Profile" />
            <SideBarItems setClickFunc={hideSidebar} href="/mpin/update" icon={<ShieldCheck className="w-5 h-5" />} title="MPIN" />
          </div>
        </div>

        {/* User profile block at bottom of drawer */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 px-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 flex items-center justify-center font-semibold text-sm flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{userDetails.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{userDetails.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
