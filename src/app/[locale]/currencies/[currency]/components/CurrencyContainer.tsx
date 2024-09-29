import { fetchWhistoryByCurrency } from '@/actions/wallet-history';
import { WithMounted } from '@/components/WithMounted';
import WhistoryComposedChart from '@/widgets/whistory-composed-chart/WhistoryComposedChart';
import CurrencyComposedTable from './currency-composed-table/CurrencyComposedTable';
import WhistoryComposedChangesChart from '@/widgets/whistory-composed-changes-chart/WhistoryComposedChangesChart';

interface Props {
  currency: string;
  fromTs?: number;
  toTs?: number;
}

export default async function CurrencyContainer({ currency, fromTs, toTs }: Props) {
  const response = await fetchWhistoryByCurrency(currency, { fromTs, toTs });

  if (!response.data) {
    return null;
  }

  return (
    <div className="grid h-full w-full grid-cols-[1fr,_1fr] grid-rows-[auto,_1fr] gap-5">
      <div className="col-span-1 row-span-1 overflow-auto">
        <CurrencyComposedTable walletHistory={response.data} />
      </div>

      <div className="col-span-1 row-span-1 flex flex-col items-center justify-start overflow-y-auto">
        <WithMounted>
          <WhistoryComposedChart width={650} height={300} data={response.data} />
        </WithMounted>

        <WithMounted>
          <WhistoryComposedChangesChart width={650} height={300} data={response.data} />
        </WithMounted>
      </div>
    </div>
  );
}
