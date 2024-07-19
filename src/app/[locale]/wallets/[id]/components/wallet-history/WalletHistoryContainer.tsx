import { fetchWalletHistory } from "@/actions/wallet-history";
import WalletHistoryChart from "@/widgets/wallet-history-chart/WalletHistoryChart";
import WhistoryChangesChart from "@/widgets/whistory-changes-chart/WhistoryChangesChart";
import { WithMounted } from "@/components/WithMounted";

import WalletHistoryTable from "./WalletHistoryTable";
import { Dictionary } from "@/types/locale";

interface WalletHistoryContainerProps {
  d: Dictionary["whistoryPage"];
  walletId: string;
  fromTs?: number;
  toTs?: number;
}

export default async function WalletHistoryContainer({
  d,
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
      <div className="w-full h-full max-w-[550px] flex flex-col">
        {walletHistory.length ? (
          <WalletHistoryTable
            d={d.whistoryTable}
            walletHistory={walletHistory}
          />
        ) : (
          <p>{d.whistoryEmpty}</p>
        )}
      </div>

      <div className="h-full w-full">
        <div className="h-full w-full overflow-y-auto flex justify-between max-[1875px]:flex-col">
          {walletHistory.length > 1 ? (
            <>
              <WithMounted>
                <WalletHistoryChart
                  width={525}
                  height={300}
                  list={walletHistory}
                />
              </WithMounted>

              <WithMounted>
                <WhistoryChangesChart
                  width={525}
                  height={300}
                  list={walletHistory}
                />
              </WithMounted>
            </>
          ) : (
            <p>{d.notEnoughDataForChart}</p>
          )}
        </div>
      </div>
    </>
  ) : (
    <p>Wallet History fetch failed 😢</p>
  );
}
