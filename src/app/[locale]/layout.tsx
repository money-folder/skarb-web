import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";

import DictionaryProvider from "@/shared/components/Dictionary";
import OverlayProvider from "@/shared/components/overlay/OverlayProvider";
import Loading from "@/shared/components/sidebar/Loading";
import Sidebar from "@/shared/components/sidebar/Sidebar";

import { getDictionary } from "@/dictionaries";

import "./globals.css";

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
        className={`${inter.className} w-full h-screen overflow-hidden grid grid-cols-[auto,_1fr,_1fr] grid-rows-[1fr,_1fr,_auto]`}
      >
        <DictionaryProvider d={d}>
          <OverlayProvider>
            <div className="col-span-1 row-span-4">
              <Suspense fallback={<Loading />}>
                <Sidebar d={d["sidebar"]} locale={locale} />
              </Suspense>
            </div>

            <div className="p-5 col-span-2 row-span-2">{children}</div>

            <footer className="p-1 col-span-2 row-span-1 flex justify-end bg-black">
              <ul className="px-5 flex gap-4 text-xs">
                <li className="text-white hover:underline">
                  {/* eslint-disable-next-line react/jsx-no-literals */}
                  <Link href="/wallets">In English</Link>
                </li>
                <li className="text-white hover:underline">
                  {/* eslint-disable-next-line react/jsx-no-literals */}
                  <Link href="/be/wallets">Па Беларуску</Link>
                </li>
              </ul>
            </footer>
          </OverlayProvider>
        </DictionaryProvider>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
