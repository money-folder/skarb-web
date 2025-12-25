import WhistoryComposedChart from "@/app/[locale]/currencies/[currency]/history/components/whistory-composed-chart/WhistoryComposedChart";
import { Locale } from "@/locale";
import { WithMounted } from "@/shared/components/WithMounted";
import {
  CHART_HEIGHT_DEFAULT,
  CHART_WIDTH_DEFAULT,
} from "@/shared/constants/charts";

import { fetchCurrencyWhistory } from "../actions";
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
  const response = await fetchCurrencyWhistory(currency, { fromTs, toTs });
  if (!response.data || !response.data.composedWhistory.length) {
    return null;
  }

  return (
    <div className="grid h-full w-full grid-cols-[1fr,_1fr] grid-rows-[1fr] gap-5">
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
      </div>
    </div>
  );
}
