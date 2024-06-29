import { fetchWalletHistory } from "@/actions/wallet-history";
import CreateWhistoryButton from "@/widgets/create-whistory/CreateWhistoryButton";
import WalletHistoryChart from "@/widgets/wallet-history-chart/WalletHistoryChart";

import WalletHistoryTable from "./WalletHistoryTable";

interface WalletHistoryContainerProps {
  walletId: string;
}

export default async function WalletHistoryContainer({
  walletId,
}: WalletHistoryContainerProps) {
  const { data: walletHistory } = await fetchWalletHistory(walletId);

  return walletHistory ? (
    <>
      <div className="w-full h-full max-w-[475px] flex flex-col">
        <div>
          <CreateWhistoryButton walletId={walletId} text="Create" />
        </div>

        <div className="mt-5 flex-1 overflow-auto">
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
            <WalletHistoryChart width={600} height={300} list={walletHistory} />
          ) : (
            <p>Not enough data for building a chart 😢</p>
          )}
        </div>
      </div>
    </>
  ) : (
    <p>Wallet History fetch failed 😢</p>
  );
}
