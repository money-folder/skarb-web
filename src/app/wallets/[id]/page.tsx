import { Suspense } from "react";

import WalletHistoryContainer from "./components/wallet-history/WalletHistoryContainer";
import Loading from "./components/wallet-history/Loading";

interface Props {
  params: { id: string };
}

export default function WalletHistory({ params: { id } }: Props) {
  return (
    <main className="w-full h-full grid grid-cols-[1fr,_1fr] grid-rows-[auto,_1fr] gap-5 overflow-hidden">
      <h1 className="w-full col-span-3 row-span-1 text-center font-extrabold text-lg">
        Wallet History
      </h1>

      <div className="h-full row-span-1 col-span-2 flex gap-5 overflow-hidden">
        <Suspense fallback={<Loading />}>
          <WalletHistoryContainer walletId={id} />
        </Suspense>
      </div>
    </main>
  );
}
