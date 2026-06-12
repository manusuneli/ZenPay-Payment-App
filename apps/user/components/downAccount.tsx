"use client";
import { useEffect, useRef, useState } from "react";
import { AppBarClient } from "./appbarclient";
import SideBarItems from "@repo/ui/sidebaritems";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DownAccountBar() {
  const [isAccountBar, setIsAccountBar] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { data } = useSession();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");

  // Set user's first name
  useEffect(() => {
    if (data?.user?.name) {
      const [first] = data.user.name.split(" ");
      setFirstName(first || "");
    }
  }, [data]);

  // Outside click detection
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsAccountBar(false);
      }
    }

    if (isAccountBar) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAccountBar]);

  return (
    <div>
      <AppBarClient setIsAccountBar={setIsAccountBar} isAccountBar={isAccountBar} />

      {isAccountBar && (
        <>
          {/* Mobile-only dark backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden" onClick={() => setIsAccountBar(false)}></div>

          {/* Sidebar container */}
          <div
            ref={sidebarRef}
            className={`
              fixed z-50 transition-transform duration-300 ease-in-out
              ${isAccountBar ? "translate-x-0" : "translate-x-full"}
              right-0 top-0
              w-64
              bg-pink-200 p-4 border border-pink-300 rounded-2xl shadow-lg
              lg:absolute lg:right-16 lg:top-20 lg:rounded-xl lg:border lg:bg-white lg:shadow-xl
            `}
          >
            <div className="flex flex-col items-center">
              <Avatar />
              <div className="text-xl font-bold mt-2 mb-4 text-gray-800">
                Hello {firstName},
              </div>

              <ul className="space-y-2 font-medium w-full">
                <SideBarItems
                  href="/profile"
                  icon={<ProfileIcon />}
                  title="Profile"
                  setClickFunc={() => setIsAccountBar(false)}
                />
                <SideBarItems
                  href="/mpin/update"
                  icon={<MPINIcon />}
                  title="MPIN"
                  setClickFunc={() => setIsAccountBar(false)}
                />
                <SideBarItems
                  href="/balance"
                  icon={<BalanceIcon />}
                  title="Balances & Transfers"
                  setClickFunc={() => setIsAccountBar(false)}
                />
              </ul>

              <LogOut onClick={async () => {
                await signOut();
                router.push("/auth/signin");
              }} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}


function Avatar() {
  return (
    <div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20">
        <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
        </svg>

      </div>
    );
  }
  
  
  function ProfileIcon()
  {
    return (
        <div className="pt-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
            </svg>

        </div>
    )
  }
function MPINIcon() {
  return (
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
        <path d="M12 1a5 5 0 00-5 5v3H5.5A1.5 1.5 0 004 10.5v9A3.5 3.5 0 007.5 23h9a3.5 3.5 0 003.5-3.5v-9A1.5 1.5 0 0018.5 9H17V6a5 5 0 00-5-5zm-3 5a3 3 0 116 0v3h-6V6zm3 8a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
      </svg>
    </div>
  );
}

  
function LogOutIcon()
{
    return (
        <div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 21h4a2 2 0 002-2V5a2 2 0 00-2-2H3"
                    />
            </svg>
        </div>
    )
  }
type LogOutProps = {
  onClick: () => void;
};

function LogOut({ onClick }: LogOutProps) {
  return (
    <div className="flex justify-center mt-4 w-full">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-center text-white bg-gray-800 hover:bg-gray-900 rounded-lg px-4 py-2 transition-transform hover:-translate-y-0.5 hover:scale-105"
      >
        <LogOutIcon />
        <span className="ml-2">Logout</span>
      </button>
    </div>
  );
}

function BalanceIcon()
{
    return (
        <div className="pt-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path d="M12 7.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
            <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 14.625v-9.75ZM8.25 9.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM18.75 9a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V9.75a.75.75 0 0 0-.75-.75h-.008ZM4.5 9.75A.75.75 0 0 1 5.25 9h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V9.75Z" clipRule="evenodd" />
            <path d="M2.25 18a.75.75 0 0 0 0 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 0 0-.75-.75H2.25Z" />
            </svg>

        </div>
    )
}
