import React from "react";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "../app/lib/auth";
import { prisma } from "@repo/db/client";
import { Home, ArrowLeftRight, Users, CreditCard, User, ShieldCheck, History, FileText, Bell } from "lucide-react";
import SideBarItems from "@repo/ui/sidebaritems";

export default async function SidebarPC({ type }: { type: "Dashboard" | "Profile" }) {
  if (type !== "Dashboard") return null;

  const session = await getServerSession(NEXT_AUTH);
  const userId = session?.user?.id;
  
  let unreadCount = 0;
  let userDetails = { name: "User", email: "" };

  if (userId) {
    // Fetch unread/actionable notifications count from DB
    unreadCount = await prisma.notification.count({
      where: {
        userId: Number(userId),
        OR: [
          { splitId: null },
          { splitEntry: { status: "PENDING" } }
        ]
      }
    });

    // Fetch user details
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: { name: true, email: true }
    });
    if (user) {
      userDetails.name = user.name || "User";
      userDetails.email = user.email || "";
    }
  }

  const initials = userDetails.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white dark:bg-[#0d0d1a] border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between py-6 z-30 transition-colors duration-300">
      <div className="space-y-1 overflow-y-auto px-2">
        <SideBarItems href="/dashboard" icon={<Home className="w-5 h-5" />} title="Home" />
        <SideBarItems href="/transfer/deposit" icon={<ArrowLeftRight className="w-5 h-5" />} title="Transfer" />
        <SideBarItems href="/p2p" icon={<Users className="w-5 h-5" />} title="P2P Transfer" />
        <SideBarItems href="/split-bill" icon={<FileText className="w-5 h-5" />} title="Bills Split" />
        <SideBarItems 
          href="/notificationsnpendings" 
          icon={<Bell className="w-5 h-5" />} 
          title="Notifications" 
          badge={
            unreadCount > 0 ? (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white leading-none">
                {unreadCount}
              </span>
            ) : null
          }
        />
        <SideBarItems href="/transactions/deposit" icon={<History className="w-5 h-5" />} title="Transactions" />
        <SideBarItems href="/accounts" icon={<CreditCard className="w-5 h-5" />} title="Cards" />
        <SideBarItems href="/profile" icon={<User className="w-5 h-5" />} title="Profile" />
        <SideBarItems href="/mpin/update" icon={<ShieldCheck className="w-5 h-5" />} title="MPIN" />
      </div>

      {/* User Profile Block at the Bottom */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-4 px-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 flex items-center justify-center font-semibold text-sm flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{userDetails.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{userDetails.email}</p>
        </div>
      </div>
    </div>
  );
}