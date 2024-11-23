// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as Material from "@mui/material";

import { Suspense } from "react";

import { getDictionary } from "@/dictionaries";
import WalletsContainer from "./components/wallets-table/WalletsContainer";
import Loading from "./components/wallets-table/Loading";

interface Props {
  params: {
    locale: string;
  };
}

export default async function Wallets({ params: { locale } }: Props) {
  const d = await getDictionary(locale);

  return (
    <main className="w-full">
      <h1 className="w-full text-center font-extrabold text-lg">
        {d.walletsPage.title}
      </h1>

      <Material.Button />

      <div className="mt-10 w-full flex flex-col items-center">
        <div className="w-10/12">
          <Suspense fallback={<Loading d={d.walletsPage.walletsTable} />}>
            <WalletsContainer locale={locale} d={d.walletsPage} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
