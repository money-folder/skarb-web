import WhistoryChangesChart from "@/app/[locale]/currencies/[currency]/history/components/whistory-changes-chart/WhistoryChangesChart";
import { fetchWalletHistory } from "@/app/[locale]/wallets/[id]/actions";
import WalletHistoryChart from "@/app/[locale]/wallets/[id]/components/whistory-chart/WalletHistoryChart";
import WhistoryChartContainer from "@/app/[locale]/wallets/[id]/components/whistory-chart/WhistoryChartContainer";
import { getDictionary } from "@/dictionaries";
import { Locale } from "@/locale";
import { WithMounted } from "@/shared/components/WithMounted";
import {
  CHART_HEIGHT_DEFAULT,
  CHART_WIDTH_DEFAULT,
} from "@/shared/constants/charts";

import WhistoryTableContainer from "./WhistoryTableContainer";

interface WalletHistoryContainerProps {
  locale: Locale;
  walletId: string;
  fromTs?: number;
  toTs?: number;
  page?: number;
  detailization?: number;
}

export default async function WalletHistoryContainer({
  locale,
  walletId,
  fromTs,
  toTs,
  page,
  detailization,
}: WalletHistoryContainerProps) {
  const d = await getDictionary(locale, "whistoryPage");

  const { data: walletHistory } = await fetchWalletHistory(walletId, {
    fromTs,
    toTs,
  });

  if (!walletHistory || !walletHistory.whistory) {
    return <p>{d.loadingWhistoryFailed}</p>;
  }

  return (
    <div className="grid h-full w-full grid-cols-[1fr,_1fr] grid-rows-[auto] gap-5">
      <div className="col-span-1 row-span-1 flex h-full w-full max-w-[550px] flex-col overflow-auto">
        <WhistoryTableContainer
          locale={locale}
          walletId={walletId}
          fromTs={fromTs}
          toTs={toTs}
          page={page}
          pageSize={10}
        />
      </div>

      <div className="h-full w-full overflow-y-auto">
        <div className="col-span-1 row-span-1 flex h-full w-full flex-col justify-between gap-5">
          {walletHistory.whistory.length > 1 ? (
            <>
              <WhistoryChartContainer
                locale={locale}
                walletId={walletId}
                fromTs={fromTs}
                toTs={toTs}
                detailization={detailization}
              />

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
  );
}
