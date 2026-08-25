"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";

interface sidebarProps {
  href: string;
  title?: string;
  icon?: React.ReactNode;
  setClickFunc?: () => void;
  badge?: React.ReactNode;
}

export default function SideBarItems({ href, title, icon, setClickFunc, badge }: sidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  // If path starts with href (to handle sub-pages, except for root home)
  const selected = href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <div
      onClick={() => {
        router.push(href);
        if (setClickFunc) {
          setClickFunc();
        }
      }}
      className={`group flex items-center justify-between mx-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 select-none ${
        selected
          ? "bg-purple-600 text-white font-semibold shadow-md shadow-purple-500/10"
          : "text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800/60 hover:text-purple-600 dark:hover:text-purple-400"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`transition-colors duration-200 ${
          selected 
            ? "text-white" 
            : "text-slate-500 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400"
        }`}>
          {icon}
        </div>
        <span className="text-sm font-medium">{title}</span>
      </div>
      {badge && <div className="flex-shrink-0">{badge}</div>}
    </div>
  );
}