"use client"
import { prisma } from "@repo/db/client";
import { AppBar } from "@repo/ui/appbar"
import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AppBarClient {
    setIsAccountBar: (e: boolean) => void,
    isAccountBar: boolean
}

async function getNoti()
{
    const session = useSession();
    if(!session.data?.user?.email)
    {
        return {};
    }

    try {
        const noti = await prisma.user.findUnique({
            where: {
                email: session.data?.user?.email
            },
            include: {
                notifications:true
            }
        })
        return noti;
    }
    catch{
        return null;
    }
}

export function AppBarClient({setIsAccountBar, isAccountBar} : AppBarClient) {
    const router = useRouter();
    const session = useSession();
    const [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const noti = getNoti();
    return (
        <div
            className={`fixed top-0 w-full z-50 transition-shadow duration-300 bg-pink-50 ${
                isScrolled ? "shadow-xl backdrop-blur-xl bg-pink-50/70" : "bg-transparent"
            }`}
        >
            <AppBar
                onSignin={() => {
                    router.push("/auth/signin")
                }}
                onSignout={async () => {
                    await signOut();
                    router.push("/auth/signin");
                }}
                user={session?.data?.user}
                notifications={noti}
            />
        </div>
    )
}