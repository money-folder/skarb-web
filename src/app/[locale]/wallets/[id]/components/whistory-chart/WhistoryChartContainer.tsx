import { getDictionary } from "@/dictionaries";
import { Locale } from "@/locale";
import { WithMounted } from "@/shared/components/WithMounted";

import { fetchWhistoryChartData } from "../../actions";
import WhistoryChartClient from "./WhistoryChartClient";

interface Props {
  locale: Locale;
  walletId: string;
  fromTs?: number;
  toTs?: number;
  detailization?: number;
}

export default async function WhistoryChartContainer({
  locale,
  walletId,
  fromTs,
  toTs,
  detailization = 30,
}: Props) {
  const d = await getDictionary(locale, "whistoryPage");

  const { data: walletHistory } = await fetchWhistoryChartData(walletId, {
    fromTs,
    toTs,
    detailization,
  });

  if (!walletHistory || !walletHistory.whistory) {
    return <p>{d.loadingWhistoryFailed}</p>;
  }

  if (walletHistory.whistory.length < 2) {
    return <p>{d.notEnoughDataForChart}</p>;
  }

  return (
    <WithMounted>
      <WhistoryChartClient
        walletId={walletId}
        fromTs={fromTs}
        toTs={toTs}
        detailization={detailization}
        initialData={walletHistory.whistory}
      />
    </WithMounted>
  );
}
