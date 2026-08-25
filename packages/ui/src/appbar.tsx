"use client";

import { JSX, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sun, Moon, Bell, LogOut, Loader2, Check } from "lucide-react";
import { Button } from "./button";

interface AppbarProps {
  user?: { name?: string | null; email?: string | null };
  onSignin: any;
  onSignout: any;
  notifications: any[];
  theme: "light" | "dark";
  toggleTheme: () => void;
  onNotificationAction: (id: number, action: "APPROVE" | "PAY", status: string) => Promise<void>;
}

export function AppBar({
  user,
  onSignin,
  onSignout,
  notifications = [],
  theme,
  toggleTheme,
  onNotificationAction,
}: AppbarProps): JSX.Element {
  const [showNotiDropdown, setShowNotiDropdown] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotiDropdown(false);
      }
    };
    if (showNotiDropdown) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showNotiDropdown]);

  let initials = "";
  if (user?.name) {
    initials = user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  }

  // Actionable count (notifications associated with PENDING splits)
  const pendingNotiCount = notifications.filter(
    (n) => n.splitId && n.splitEntry?.status === "PENDING"
  ).length;

  return (
    <div className="flex justify-between items-center px-4 md:px-8 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d0d1a] transition-colors duration-300">
      {/* Brand logo */}
      <div 
        onClick={() => router.push("/dashboard")}
        className="text-2xl font-extrabold tracking-tight text-purple-600 dark:text-purple-400 cursor-pointer select-none"
      >
        ZenPay
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition duration-200"
          title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        {/* Notifications Dropdown anchor */}
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowNotiDropdown(!showNotiDropdown)}
              className="relative p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition duration-200"
            >
              <Bell className="w-5 h-5" />
              {pendingNotiCount > 0 && (
                <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>

            {/* Premium Notification dropdown */}
            {showNotiDropdown && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-3 z-50 transition-colors duration-300 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex justify-between items-center px-4 pb-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200">Recent Notifications</span>
                  {pendingNotiCount > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400 rounded-full">
                      {pendingNotiCount} Pending
                    </span>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto mt-2 px-2 divide-y divide-slate-100 dark:divide-slate-700/50">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => {
                      const isPending = n.splitId && n.splitEntry?.status === "PENDING";
                      return (
                        <div 
                          key={n.id} 
                          className={`p-3 text-xs flex flex-col gap-2 rounded-xl transition duration-200 ${
                            isPending 
                              ? "bg-purple-50/40 dark:bg-purple-950/10" 
                              : "opacity-80 hover:bg-slate-50 dark:hover:bg-slate-700/30"
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{n.title}</span>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 flex-shrink-0">
                              {new Date(n.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 line-clamp-2">{n.message}</p>
                          
                          {/* Split bill action button */}
                          {n.splitId && (
                            <div className="flex justify-end mt-1">
                              {n.splitEntry?.status === "SUCCESS" || n.splitEntry?.status === "PAID" ? (
                                <span className="flex items-center gap-1 font-semibold text-green-600 dark:text-green-400">
                                  <Check className="w-3.5 h-3.5" /> Paid
                                </span>
                              ) : n.splitEntry?.status === "REJECTED" ? (
                                <span className="font-semibold text-red-500 dark:text-red-400">
                                  Rejected
                                </span>
                              ) : (
                                <button
                                  onClick={async () => {
                                    setActionLoadingId(n.id);
                                    await onNotificationAction(n.id, n.action, n.splitEntry?.status);
                                    setActionLoadingId(null);
                                  }}
                                  disabled={actionLoadingId === n.id}
                                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition duration-200 disabled:opacity-50 flex items-center gap-1 shadow-sm shadow-purple-500/10"
                                >
                                  {actionLoadingId === n.id ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    n.action === "APPROVE" ? "Approve" : "Pay Now"
                                  )}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="text-center pt-2 px-4 border-t border-slate-100 dark:border-slate-700 mt-2">
                  <button 
                    onClick={() => {
                      setShowNotiDropdown(false);
                      router.push("/notificationsnpendings");
                    }}
                    className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* User initials bubble */}
        {user && (
          <div
            className="flex justify-center items-center text-purple-700 dark:text-purple-300 font-bold text-sm h-9 w-9 rounded-xl bg-purple-100 dark:bg-purple-950 border border-purple-200 dark:border-purple-900 cursor-default select-none transition-colors duration-300"
            title={user.name || ""}
          >
            {initials}
          </div>
        )}

        {/* Auth action button */}
        <div>
          <button
            onClick={user ? onSignout : onSignin}
            className="px-4 py-2 rounded-xl text-xs md:text-sm font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition duration-200 flex items-center gap-1.5 shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">
              {user ? "Log Out" : "Login"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
