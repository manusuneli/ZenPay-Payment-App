"use client";
import SideBarItems from "@repo/ui/sidebaritems";
import { useState, useRef, useEffect } from "react";
import { HomeIcon, P2P, Transactions, Transfer } from "@repo/ui/icons";
import { MdOutlineGroupAdd } from "react-icons/md";
import { FaRegCreditCard } from "react-icons/fa";
export default function SideBarMobile({ type }: { type: "Profile" | "Dashboard" }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

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

  return (
    <div>
      {/* Hamburger / Close button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        type="button"
        className={`
          fixed top-20 left-4 z-50
          p-3 rounded-xl shadow-md
          bg-slate-50 text-purple-600
          hover:bg-slate-100
          border border-slate-200
          transition duration-300 ease-in-out
          lg:hidden
        `}
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isSidebarOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 z-50
          w-72 max-w-full
          h-screen
          transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300 ease-in-out
          bg-slate-50
          border-r border-slate-200
          shadow-xl
          rounded-r-2xl
          p-6
          lg:hidden
        `}
      >
        <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 mb-8">
          Dashboard
        </div>

        <ul className="space-y-4 text-slate-700">
          <li><SideBarItems setClickFunc={hideSidebar} href="/dashboard" icon={<HomeIcon />} title="Home" /></li>
          <li><SideBarItems setClickFunc={hideSidebar} href="/transfer/deposit" icon={<Transfer />} title="Transfer" /></li>
          <li><SideBarItems setClickFunc={hideSidebar} href="/p2p" icon={<P2P />} title="P2P Transfer" /></li>
          <li><SideBarItems setClickFunc={hideSidebar} href="/split-bill" icon={<MdOutlineGroupAdd size={24} />} title="Bills Split" /></li>
          <li><SideBarItems setClickFunc={hideSidebar} href="/notificationsnpendings" icon={<Transactions />} title="Notifications" /></li>
          <li><SideBarItems setClickFunc={hideSidebar} href="/transactions/deposit" icon={<Transactions />} title="Transactions" /></li>
          <li><SideBarItems setClickFunc={hideSidebar} href="/accounts" icon={<FaRegCreditCard size={24} />} title="Cards" /></li>
          <li><SideBarItems setClickFunc={hideSidebar} href="/profile" icon={<ProfileIcon />} title="Profile" /></li>
          <li><SideBarItems setClickFunc={hideSidebar} href="/mpin/update" icon={<MPINIcon />} title="MPIN" /></li>
        </ul>
      </div>
    </div>
  );
}

// === Icons ===
function ProfileIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
}

function MPINIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75M3.75 18.75h16.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
  );
}
