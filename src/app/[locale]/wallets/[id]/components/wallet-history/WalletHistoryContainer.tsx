import { fetchWalletHistory } from "@/actions/wallet-history";
import WalletHistoryChart from "@/widgets/wallet-history-chart/WalletHistoryChart";
import WhistoryChangesChart from "@/widgets/whistory-changes-chart/WhistoryChangesChart";
import { WithMounted } from "@/components/WithMounted";
import WalletChangesSummaryCard from "@/components/cards/WalletChangesSummaryCard";

import WalletHistoryTable from "./WalletHistoryTable";
import { Dictionary } from "@/types/locale";
import WhistoryEntriesSummaryCard from "@/components/cards/WhistoryEntriesSummaryCard";

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
    <div className="h-full w-full grid gap-5 grid-cols-[1fr,_1fr] grid-rows-[auto,_1fr]">
      <div className="col-span-2 row-span-1 flex gap-5">
        <WalletChangesSummaryCard
          text={d.cards.walletChangesSummary.title}
          increases={walletHistory.increasesSum}
          decreases={walletHistory.decreasesSum}
          diff={walletHistory.increasesDecreasesDiff}
        />

        {walletHistory.whistory.length ? (
          <WhistoryEntriesSummaryCard
            d={d.cards.whistoryEntriesSummary}
            startDate={walletHistory.whistory[0].date}
            endDate={
              walletHistory.whistory[walletHistory.whistory.length - 1].date
            }
            entriesCount={walletHistory.whistory.length}
          />
        ) : null}
      </div>

      <div className="w-full h-full max-w-[550px] overflow-auto col-span-1 row-span-1 flex flex-col">
        {walletHistory.whistory.length ? (
          <WalletHistoryTable
            d={d.whistoryTable}
            walletHistory={walletHistory.whistory}
          />
        ) : (
          <p>{d.whistoryEmpty}</p>
        )}
      </div>

      <div className="h-full w-full">
        <div className="h-full w-full overflow-y-auto col-span-1 row-span-1 flex justify-between max-[1875px]:flex-col">
          {walletHistory.whistory.length > 1 ? (
            <>
              <WithMounted>
                <WalletHistoryChart
                  width={525}
                  height={300}
                  list={walletHistory.whistory}
                />
              </WithMounted>

              <WithMounted>
                <WhistoryChangesChart
                  width={525}
                  height={300}
                  list={walletHistory.whistory}
                />
              </WithMounted>
            </>
          ) : (
            <p>{d.notEnoughDataForChart}</p>
          )}
        </div>
      </div>
    </div>
  ) : (
    <p>Wallet History fetch failed 😢</p>
  );
}
