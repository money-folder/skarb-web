import { Suspense } from "react";

import { getDictionary } from "@/dictionaries";
import Loading from "./components/wallets-table/Loading";
import WalletsContainer from "./components/wallets-table/WalletsContainer";

interface Props {
  params: {
    locale: string;
  };
}

export default async function Wallets({ params: { locale } }: Props) {
  const d = await getDictionary(locale);

  return (
    <main className="w-full">
      <h1 className="w-full text-center text-lg font-extrabold">
        {d.walletsPage.title}
      </h1>

      <div className="mt-10 flex w-full flex-col items-center">
        <div className="w-10/12">
          <Suspense fallback={<Loading d={d.walletsPage.walletsTable} />}>
            <WalletsContainer locale={locale} d={d.walletsPage} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
