import { fetchWhistoryByCurrency } from "@/actions/wallet-history";
import { WithMounted } from "@/components/WithMounted";
import WhistoryComposedChart from "@/widgets/whistory-composed-chart/WhistoryComposedChart";

interface Props {
  currency: string;
}

export default async function CurrencyContainer({ currency }: Props) {
  const response = await fetchWhistoryByCurrency(currency);

  if (!response.data) {
    return null;
  }

  return (
    <div className="w-full flex justify-center">
      <WithMounted>
        <WhistoryComposedChart width={850} height={350} data={response.data} />
      </WithMounted>
    </div>
  );
}
