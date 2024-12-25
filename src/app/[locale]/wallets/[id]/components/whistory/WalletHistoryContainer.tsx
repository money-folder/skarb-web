import WalletHistoryChart from "@/app/[locale]/wallets/[id]/components/whistory-chart/WalletHistoryChart";
import WhistoryChangesChart from "@/app/[locale]/currencies/[currency]/components/whistory-changes-chart/WhistoryChangesChart";
import { WithMounted } from "@/shared/components/WithMounted";
import { fetchWalletHistory } from "@/app/[locale]/wallets/[id]/actions";
import WalletChangesSummaryCard from "@/shared/components/cards/WalletChangesSummaryCard";

import WhistoryEntriesSummaryCard from "@/shared/components/cards/WhistoryEntriesSummaryCard";
import {
  CHART_HEIGHT_DEFAULT,
  CHART_WIDTH_DEFAULT,
} from "@/shared/constants/charts";
import { Dictionary } from "@/shared/types/locale";
import WalletHistoryTable from "./WalletHistoryTable";

interface WalletHistoryContainerProps {
  d: Dictionary["whistoryPage"];
  locale: string;
  walletId: string;
  fromTs?: number;
  toTs?: number;
}

export default async function WalletHistoryContainer({
  d,
  locale,
  walletId,
  fromTs,
  toTs,
}: WalletHistoryContainerProps) {
  const { data: walletHistory } = await fetchWalletHistory(walletId, {
    fromTs,
    toTs,
  });

  return walletHistory ? (
    <div className="w-full grid h-full  grid-cols-[1fr,_1fr] grid-rows-[auto,_1fr] gap-5">
      <div className="col-span-2 row-span-1 flex gap-5">
        <WalletChangesSummaryCard
          text={d.cards.walletChangesSummary.title}
          increases={walletHistory.increasesSum}
          decreases={walletHistory.decreasesSum}
          diff={walletHistory.increasesDecreasesDiff}
        />

        {walletHistory.whistory.length ? (
          <WhistoryEntriesSummaryCard
            locale={locale}
            d={d.cards.whistoryEntriesSummary}
            startDate={walletHistory.whistory[0].date}
            endDate={
              walletHistory.whistory[walletHistory.whistory.length - 1].date
            }
            entriesCount={walletHistory.whistory.length}
          />
        ) : null}
      </div>

      <div className="col-span-1 row-span-1 flex h-full w-full max-w-[550px] flex-col overflow-auto">
        {walletHistory.whistory.length ? (
          <WalletHistoryTable
            d={d.whistoryTable}
            walletHistory={walletHistory.whistory}
          />
        ) : (
          <p>{d.whistoryEmpty}</p>
        )}
      </div>

      <div className="h-full w-full overflow-y-auto">
        <div className="col-span-1 row-span-1 flex h-full w-full flex-col justify-between">
          {walletHistory.whistory.length > 1 ? (
            <>
              <WithMounted>
                <WalletHistoryChart
                  width={CHART_WIDTH_DEFAULT}
                  height={CHART_HEIGHT_DEFAULT}
                  data={walletHistory.whistory}
                />
              </WithMounted>

              <WithMounted>
                <WhistoryChangesChart
                  width={CHART_WIDTH_DEFAULT}
                  height={CHART_HEIGHT_DEFAULT}
                  data={walletHistory.whistory}
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
    <p>{d.loadingWhistoryFailed}</p>
  );
}
