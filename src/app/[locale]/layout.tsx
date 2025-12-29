import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getDictionary } from "@/dictionaries";
import DictionaryProvider from "@/shared/components/Dictionary";

import { AppSidebar } from "./components/AppSidebar/AppSidebar";
import Footer from "./components/Footer";

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
          <SidebarProvider>
            <div
              className={`${inter.className} grid h-screen w-full grid-cols-[auto,_1fr,_1fr] grid-rows-[1fr,_1fr,_auto] overflow-hidden`}
            >
              <div className="col-span-1 row-span-4">
                <AppSidebar locale={locale} />
              </div>
              <div className="col-span-2 row-span-2 p-5">
                <div className="absolute">
                  <SidebarTrigger />
                </div>
                {children}
              </div>
              <Footer d={d} />
            </div>
          </SidebarProvider>
        </DictionaryProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
