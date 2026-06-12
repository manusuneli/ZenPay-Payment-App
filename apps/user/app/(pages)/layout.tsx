import type { Metadata } from "next";
import DownAccountBar from "../../components/downAccount";



export const metadata: Metadata = {
  title: "ZenPay App",
  description: "A wallet app",
};

// Hello bvsi

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-screen bg-pink-50/70">
    <DownAccountBar />
    {children}
    </div>
  );
}

