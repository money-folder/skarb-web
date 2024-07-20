import { Suspense } from "react";

import WalletHistoryContainer from "./components/wallet-history/WalletHistoryContainer";
import Loading from "./components/wallet-history/Loading";
import WalletHistoryFilters from "./components/WalletHistoryFilters";
import { getDictionary } from "@/dictionaries";

interface Props {
  params: { id: string; locale: string };
  searchParams: { whistoryFrom?: string; whistoryTo?: string };
}

export default async function WalletHistory({
  params: { id, locale },
  searchParams,
}: Props) {
  const d = await getDictionary(locale);

  return (
    <main className="w-full h-full grid grid-cols-[1fr,_1fr] grid-rows-[auto,_auto,_1fr] gap-5 overflow-hidden">
      <h1 className="w-full col-span-3 row-span-1 text-center font-extrabold text-lg">
        {d.whistoryPage.title}
      </h1>

      <div className="p-2 w-full flex justify-center items-center col-span-3 row-span-1 bg-gray-200 rounded-lg">
        <WalletHistoryFilters d={d.whistoryPage.filters} />
      </div>

      <div className="h-full row-span-1 col-span-2 flex gap-5 overflow-hidden">
        <Suspense fallback={<Loading />}>
          <WalletHistoryContainer
            d={d.whistoryPage}
            walletId={id}
            fromTs={
              searchParams.whistoryFrom ? +searchParams.whistoryFrom : undefined
            }
            toTs={
              searchParams.whistoryTo ? +searchParams.whistoryTo : undefined
            }
          />
        </Suspense>
      </div>
    </main>
  );
}
