import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Inter } from 'next/font/google';

import Sidebar from '@/components/sidebar/Sidebar';
import OverlayProvider from '@/components/overlay/OverlayProvider';
import Loading from '@/components/sidebar/Loading';
import DictionaryProvider from '@/components/Dictionary';

import { getDictionary } from '@/dictionaries';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Skarb',
  description: 'A simple budget tracking app',
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
        className={`${inter.className} grid h-screen w-full grid-cols-[auto,_1fr,_1fr] grid-rows-[1fr,_1fr,_auto] overflow-hidden`}
      >
        <DictionaryProvider d={d}>
          <OverlayProvider>
            <div className="col-span-1 row-span-4">
              <Suspense fallback={<Loading />}>
                <Sidebar d={d['sidebar']} locale={locale} />
              </Suspense>
            </div>

            <div className="col-span-2 row-span-2 p-5">{children}</div>

            <footer className="col-span-2 row-span-1 flex justify-end bg-black p-1">
              <ul className="flex gap-4 px-5 text-xs">
                <li className="text-white hover:underline">
                  <Link href="/wallets">In English</Link>
                </li>
                <li className="text-white hover:underline">
                                     <Link href="/be/wallets">Па Беларуску</Link>
                </li>
              </ul>
                     </footer>
          </OverlayProvider>
        </DictionaryProvider>

                        < Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}















