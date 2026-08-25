"use client"
import { AppBar } from "@repo/ui/appbar"
import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "../providers/ThemeProvider";
import { getRouterDetails } from "../app/lib/actions/getRouteApprove";
import { useToast } from "../providers/ToastProvider";

export function AppBarClient() {
    const router = useRouter();
    const session = useSession();
    const { theme, toggleTheme } = useTheme();
    const { showToast } = useToast();
    const [isScrolled, setIsScrolled] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);

    const fetchNoti = async () => {
        try {
            const res = await fetch("/api/notifications");
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications || []);
            }
        } catch (err) {
            console.error("Error fetching notifications:", err);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        if (session.data?.user) {
            fetchNoti();
            const interval = setInterval(fetchNoti, 10000);
            return () => clearInterval(interval);
        }
    }, [session.data?.user]);

    const handleNotificationAction = async (id: number, action: "APPROVE" | "PAY", status: string) => {
        if (status === "REJECTED" || status === "SUCCESS" || status === "PAID") return;
        
        try {
            const routerDetails = await getRouterDetails({ id, action });
            if (routerDetails) {
                const path = action === "APPROVE" ? "approve" : "pay";
                router.push(`/split-bill/${path}/${routerDetails.token}/${routerDetails.splitId}/${routerDetails.splitBillId}`);
            } else {
                showToast("Failed to fetch transaction details", "error");
            }
        } catch (err) {
            console.error(err);
            showToast("Failed to perform action", "error");
        }
    };

    return (
        <div
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                isScrolled 
                    ? "shadow-md bg-white/80 dark:bg-[#0d0d1a]/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800" 
                    : "bg-white dark:bg-[#0d0d1a] border-b border-slate-100 dark:border-slate-800"
            }`}
        >
            <AppBar
                onSignin={() => {
                    router.push("/auth/signin")
                }}
                onSignout={async () => {
                    await signOut({ redirect: false });
                    router.push("/auth/signin");
                    showToast("Logged out successfully", "success");
                }}
                user={session?.data?.user}
                notifications={notifications}
                theme={theme}
                toggleTheme={toggleTheme}
                onNotificationAction={handleNotificationAction}
            />
        </div>
    )
}