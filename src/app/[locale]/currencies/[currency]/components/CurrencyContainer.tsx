import WhistoryComposedChangesChart from "@/app/[locale]/currencies/[currency]/components/whistory-composed-changes-chart/WhistoryComposedChangesChart";
import WhistoryComposedChart from "@/app/[locale]/currencies/[currency]/components/whistory-composed-chart/WhistoryComposedChart";
import { getDictionary } from "@/dictionaries";
import { Locale } from "@/locale";
import WalletChangesSummaryCard from "@/shared/components/cards/WalletChangesSummaryCard";
import WhistoryEntriesSummaryCard from "@/shared/components/cards/WhistoryEntriesSummaryCard";
import { WithMounted } from "@/shared/components/WithMounted";
import {
  CHART_HEIGHT_DEFAULT,
  CHART_WIDTH_DEFAULT,
} from "@/shared/constants/charts";

import { fetchCurrencyWhistory } from "../../actions";
import CurrencyComposedTable from "./currency-composed-table/CurrencyComposedTable";

interface Props {
  locale: Locale;
  currency: string;
  fromTs?: number;
  toTs?: number;
}

export default async function CurrencyContainer({
  locale,
  currency,
  fromTs,
  toTs,
}: Props) {
  const d = await getDictionary(locale, "currencyPage");

  const response = await fetchCurrencyWhistory(currency, { fromTs, toTs });
  if (!response.data || !response.data.composedWhistory.length) {
    return null;
  }

  return (
    <div className="grid h-full w-full grid-cols-[1fr,_1fr] grid-rows-[auto,_1fr] gap-5">
      <div className="col-span-2 row-span-1 flex gap-5">
        <WalletChangesSummaryCard
          text={d.cards.changesSummary.title}
          increases={response.data.increasesSum}
          decreases={response.data.decreasesSum}
          diff={response.data.increasesDecreasesDiff}
        />

        {response.data.composedWhistory.length ? (
          <WhistoryEntriesSummaryCard
            locale={locale}
            startDate={response.data.composedWhistory[0].date}
            endDate={
              response.data.composedWhistory[
                response.data.composedWhistory.length - 1
              ].date
            }
            entriesCount={response.data.composedWhistory.length}
          />
        ) : null}
      </div>

      <div className="col-span-1 row-span-1 overflow-auto">
        <CurrencyComposedTable
          locale={locale}
          walletHistory={response.data.composedWhistory}
        />
      </div>

      <div className="col-span-1 row-span-1 flex flex-col items-center justify-start overflow-y-auto">
        <WithMounted>
          <WhistoryComposedChart
            width={CHART_WIDTH_DEFAULT}
            height={CHART_HEIGHT_DEFAULT}
            data={response.data.composedWhistory}
          />
        </WithMounted>

        <WithMounted>
          <WhistoryComposedChangesChart
            width={CHART_WIDTH_DEFAULT}
            height={CHART_HEIGHT_DEFAULT}
            data={response.data.composedWhistory}
          />
        </WithMounted>
      </div>
    </div>
  );
}
