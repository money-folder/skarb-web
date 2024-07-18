import { Suspense } from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";

import Sidebar from "@/components/sidebar/Sidebar";
import OverlayProvider from "@/components/overlay/OverlayProvider";
import Loading from "@/components/sidebar/Loading";

import "./globals.css";
import DictionaryProvider from "@/components/Dictionary";
import { getDictionary } from "@/dictionaries";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Skarb",
  description: "A simple budget tracking app",
};

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: {
    locale: string;
  };
}>) {
  const d = await getDictionary(locale);

  return (
    <html lang={locale}>
      <body
        className={`${inter.className} w-full h-screen overflow-hidden grid grid-cols-[auto,_1fr,_1fr] grid-rows-[1fr,_1fr]`}
      >
        <DictionaryProvider d={d}>
          <OverlayProvider>
            <div className="col-span-1 row-span-3">
              <Suspense fallback={<Loading />}>
                <Sidebar d={d["sidebar"]} />
              </Suspense>
            </div>

            <div className="p-5 col-span-2 row-span-2">{children}</div>
          </OverlayProvider>
        </DictionaryProvider>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
