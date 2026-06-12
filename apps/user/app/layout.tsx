
import { AppBarClient } from "../components/appbarclient";
import Providers from "../providers";
import "./globals.css";
import type { Metadata } from "next";



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
      <html lang="en">
        <Providers>
          <body>
              <div className="min-w-screen bg-pink-50/70">
                {children}
              </div>
          </body>
        </Providers>
      </html>
  );
}


