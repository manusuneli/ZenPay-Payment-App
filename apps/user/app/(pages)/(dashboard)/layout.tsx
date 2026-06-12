import React from "react";
import { Metadata } from "next";
import SideBarMobile from "../../../components/SideBarMobile";
import SidebarPC from "../../../components/SideBarPC";

export const metadata: Metadata = {
  title: "ZenPay App",
  description: "A wallet app",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex bg-pink-50/70 min-w-screen min-h-screen z-50">
        <div className="pt-16 relative">
          <div className="lg:invisible">
            <SideBarMobile type="Dashboard" />
          </div>
          <div className="hidden lg:block lg:w-64 border-r h-full min-h-screen border-slate-300 border-sm">
            <SidebarPC type="Dashboard" />
          </div>
        </div>

        <div className="flex-1 bg-pink-50 flex justify-center">
          {children}
        </div>
      </div>
    </>
  );
}
