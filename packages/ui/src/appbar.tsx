"use client";
import { JSX } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./button";

interface AppbarProps {
  user?: { name?: string | null };
  onSignin: any;
  onSignout: any;
  notifications: any;
}

export function AppBar({
  user,
  onSignin,
  onSignout,
  notifications,
}: AppbarProps): JSX.Element {
  let firstch: string | undefined;
  let lastch: string | undefined;

  if (user?.name) {
    const username = user.name.split(" ");
    firstch = username[0]?.[0]?.toUpperCase();
    if (username.length > 1) {
      lastch = username[1]?.[0]?.toUpperCase();
    }
  }

  const router = useRouter();

  return (
    <div className="flex justify-between items-center border-b px-4 md:px-8 py-2 border-slate-300 bg-pink-50">
      <div className="text-xl md:text-3xl font-bold text-slate-800">ZenPay</div>

      <div className="flex items-center gap-3 md:gap-5">
        <button
          onClick={() => router.push("/notificationsnpendings")}
          className="relative bg-white p-2 rounded-full shadow-sm hover:bg-gray-100 transition"
        >
          <BellIcon />
          {notifications?.length > 0 && (
            <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[10px] md:text-xs font-semibold px-1.5 py-0 rounded-full">
              {notifications.length}
            </span>
          )}
        </button>

        {user && (
          <div
            className="flex justify-center items-center text-white font-semibold text-sm md:text-base h-9 w-9 md:h-11 md:w-11 rounded-full bg-slate-400"
            title={user.name || ""}
          >
            {firstch}
            {lastch}
          </div>
        )}
        <div>
          <Button onClickFunc={user ? onSignout : onSignin}>
            <div className="flex items-center">
              <LogOutIcon />
              <span className="hidden sm:inline ml-2">
                {user ? "Log Out" : "Login"}
              </span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}

function LogOutIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h4a2 2 0 002-2V5a2 2 0 00-2-2H3" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      className="w-5 h-5 text-gray-800"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11
           a6.002 6.002 0 00-4-5.659V4
           a2 2 0 00-4 0v1.341
           C7.67 6.165 6 8.388 6 11v3.159
           c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1
           a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  );
}
