import { fetchWalletHistory } from "@/actions/wallet-history";
import WalletHistoryChart from "@/widgets/wallet-history-chart/WalletHistoryChart";
import { WithMounted } from "@/components/WithMounted";

import WalletHistoryTable from "./WalletHistoryTable";

interface WalletHistoryContainerProps {
  walletId: string;
  fromTs?: number;
  toTs?: number;
}

export default async function WalletHistoryContainer({
  walletId,
  fromTs,
  toTs,
}: WalletHistoryContainerProps) {
  const { data: walletHistory } = await fetchWalletHistory(walletId, {
    fromTs,
    toTs,
  });

  return walletHistory ? (
    <>
      <div className="w-full h-full max-w-[475px] flex flex-col">
        {walletHistory.length ? (
          <WalletHistoryTable walletHistory={walletHistory} />
        ) : (
          <p>No Data</p>
        )}
      </div>

      <div className="h-full w-full">
        <div className="w-full flex justify-center">
          {walletHistory.length > 1 ? (
            <WithMounted>
              <WalletHistoryChart
                width={600}
                height={300}
                list={walletHistory}
              />
            </WithMounted>
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
