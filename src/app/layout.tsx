import { Suspense } from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";

import Header from "@/components/Header";
import Sidebar from "@/components/sidebar/Sidebar";
import OverlayProvider from "@/components/overlay/OverlayProvider";
import Loading from "@/components/sidebar/Loading";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Skarb",
  description: "A simple budget tracking app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} w-full h-screen overflow-hidden grid grid-cols-[auto,_1fr,_1fr] grid-rows-[auto,_1fr,_1fr]`}
      >
        <OverlayProvider>
          <div className="col-span-3 row-span-1">
            <Header />
          </div>

          <div className="col-span-1 row-span-3">
            <Suspense fallback={<Loading />}>
              <Sidebar />
            </Suspense>
          </div>

          <div className="p-5 col-span-2 row-span-2">{children}</div>
        </OverlayProvider>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
