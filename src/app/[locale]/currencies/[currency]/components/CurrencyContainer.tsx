import { fetchWhistoryByCurrency } from "@/actions/wallet-history";
import { WithMounted } from "@/components/WithMounted";
import WhistoryComposedChart from "@/widgets/whistory-composed-chart/WhistoryComposedChart";
import CurrencyComposedTable from "./currency-composed-table/CurrencyComposedTable";

interface Props {
  currency: string;
  fromTs?: number;
  toTs?: number;
}

export default async function CurrencyContainer({
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
        <CurrencyComposedTable walletHistory={response.data} />
      </div>

      <div className="col-span-1 row-span-1 flex justify-center">
        <WithMounted>
          <WhistoryComposedChart
            width={650}
            height={300}
            data={response.data}
          />
        </WithMounted>
      </div>
    </div>
  );
}
