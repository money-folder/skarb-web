import { Suspense } from "react";

import { getDictionary } from "@/dictionaries";
import { Locale } from "@/locale";

import Loading from "./components/wallets-table/Loading";
import WalletsContainer from "./components/wallets-table/WalletsContainer";

interface Props {
  params: {
    locale: Locale;
  };
}

export default async function Wallets({ params: { locale } }: Props) {
  const d = await getDictionary(locale, "walletsPage");

  return (
    <main className="w-full">
      <h1 className="w-full text-center text-lg font-extrabold">{d.title}</h1>
      <div className="mt-10 flex w-full flex-col items-center">
        <div className="w-10/12">
          <Suspense fallback={<Loading d={d.walletsTable} />}>
            <WalletsContainer locale={locale} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
