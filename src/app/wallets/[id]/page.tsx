import { Suspense } from "react";

import { fetchWalletHistory } from "@/actions/wallet-history";
import WalletHistoryChart from "@/widgets/wallet-history-chart/WalletHistoryChart";

import WalletHistoryTable from "./WalletHistoryTable";
import CreateWhistoryButton from "@/widgets/create-whistory/CreateWhistoryButton";

interface Props {
  params: { id: string };
}

export default async function WalletHistory({ params: { id } }: Props) {
  const { data: walletHistory } = await fetchWalletHistory(id);

  return (
    <main className="w-full h-full grid grid-cols-[1fr,_1fr] grid-rows-[auto,_1fr] gap-5 overflow-hidden">
      <h1 className="w-full col-span-3 row-span-1 text-center font-extrabold text-lg">
        Wallet History
      </h1>

      <div className="h-full row-span-1 col-span-2 flex gap-5 overflow-hidden">
        <Suspense fallback={<div>Loading...</div>}>
          {walletHistory ? (
            <>
              <div className="w-full h-full max-w-[450px] overflow-auto">
                <div>
                  <CreateWhistoryButton walletId={id} text="Create" />
                </div>

                <div className="mt-5">
                  {walletHistory.length ? (
                    <WalletHistoryTable walletHistory={walletHistory} />
                  ) : (
                    <p>No Data</p>
                  )}
                </div>
              </div>

              <div className="h-full w-full">
                <div className="w-full flex justify-center">
                  {walletHistory.length > 1 ? (
                    <WalletHistoryChart
                      width={600}
                      height={300}
                      list={walletHistory}
                    />
                  ) : (
                    <p>Not enough data for building a chart 😢</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p>Wallet History fetch failed 😢</p>
          )}
        </Suspense>
      </div>
    </main>
  );
}
