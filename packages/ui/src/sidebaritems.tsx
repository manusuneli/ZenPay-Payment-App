"use client"
import React, { useEffect, useState } from "react";
import {usePathname, useRouter} from "next/navigation"

interface sidebarProps {
    href : string;
    title ?: string;
    icon ?: React.ReactNode,
    setClickFunc?: () => void
}

export default function SideBarItems({href, title, icon, setClickFunc} : sidebarProps)
{  

    
    const router = useRouter();
    const pathname = usePathname();
    // on condition if at that point the path is there only that will be highlighted

    // useEffect(() => {
    //     // yaha pr error aa rhi thi 
    //     if (typeof setClickFunc === "function") {
    //         setClickFunc(isClicked);
    //     }
    // }, [isClicked]);

    const selected = pathname === href;
    
    return (
        <div className={`flex ml-8 p-3 cursor-pointer text-lg ${selected ? "text-purple-600 font-semibold text-xl" : "text-slate-700"} onclick`} onClick={() => {
            router.push(href);
            if(setClickFunc)
            {
                setClickFunc()
            }
          }}>
            <div className="pr-2">
            {icon}
            </div>
            <div className={`text-lg ${selected ? "text-purple-600 font-semibold text-xl" : "text-slate-700"}`}>
                {title}
            </div>
        </div>
    )
}