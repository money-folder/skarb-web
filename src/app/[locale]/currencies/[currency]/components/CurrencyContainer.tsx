import WhistoryComposedChangesChart from "@/app/[locale]/currencies/[currency]/components/whistory-composed-changes-chart/WhistoryComposedChangesChart";
import WhistoryComposedChart from "@/app/[locale]/currencies/[currency]/components/whistory-composed-chart/WhistoryComposedChart";
import { fetchWhistoryByCurrency } from "@/app/[locale]/wallets/[id]/actions";
import { WithMounted } from "@/shared/components/WithMounted";
import {
  CHART_HEIGHT_DEFAULT,
  CHART_WIDTH_DEFAULT,
} from "@/shared/constants/charts";
import { Dictionary } from "@/shared/types/locale";
import CurrencyComposedTable from "./currency-composed-table/CurrencyComposedTable";

interface Props {
  currency: string;
  fromTs?: number;
  toTs?: number;
  d: Dictionary["currencyPage"];
}

export default async function CurrencyContainer({
  d,
  currency,
  fromTs,
  toTs,
}: Props) {
  const response = await fetchWhistoryByCurrency(currency, { fromTs, toTs });

  if (!response.data) {
    return null;
  }

  return (
    <div className="h-full w-full grid gap-5 grid-cols-[1fr,_1fr] grid-rows-[auto,_1fr]">
      <div className="col-span-1 row-span-1 overflow-auto">
        <CurrencyComposedTable
          d={d.currencyTable}
          walletHistory={response.data}
        />
      </div>

      <div className="overflow-y-auto col-span-1 row-span-1 flex flex-col justify-start items-center">
        <WithMounted>
          <WhistoryComposedChart
            width={CHART_WIDTH_DEFAULT}
            height={CHART_HEIGHT_DEFAULT}
            data={response.data}
          />
        </WithMounted>

        <WithMounted>
          <WhistoryComposedChangesChart
            width={CHART_WIDTH_DEFAULT}
            height={CHART_HEIGHT_DEFAULT}
            data={response.data}
          />
        </WithMounted>
      </div>
    </div>
  );
}
