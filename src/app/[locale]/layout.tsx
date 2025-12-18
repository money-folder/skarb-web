import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";

import DictionaryProvider from "@/shared/components/Dictionary";
import OverlayProvider from "@/shared/components/overlay/OverlayProvider";
import Loading from "@/shared/components/sidebar/Loading";
import Sidebar from "@/shared/components/sidebar/Sidebar";

import { getDictionary } from "@/dictionaries";

import { Locale } from "@/locale";

import { AppSidebar } from "./components/AppSidebar/AppSidebar";
import Footer from "./components/Footer";

import { SidebarProvider } from "@/components/ui/sidebar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Skarb",
  description: "A simple budget tracking app",
};

export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
    params: Promise<{
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      locale: any;
    }>;
  }>,
) {
  const params = await props.params;

  const { locale } = params;

  const { children } = props;

  const d = await getDictionary(locale);

  return (
    <html lang={locale}>
      <body>
        <DictionaryProvider d={d} locale={locale}>
          <OverlayProvider>
            <SidebarProvider>
              <div
                className={`${inter.className} grid h-screen w-full grid-cols-[auto,_1fr,_1fr] grid-rows-[1fr,_1fr,_auto] overflow-hidden`}
              >
                <div className="col-span-1 row-span-4">
                  <AppSidebar />
                </div>
                <div className="col-span-2 row-span-2 p-5">{children}</div>
                <Footer d={d} />
              </div>
            </SidebarProvider>
          </OverlayProvider>
        </DictionaryProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
