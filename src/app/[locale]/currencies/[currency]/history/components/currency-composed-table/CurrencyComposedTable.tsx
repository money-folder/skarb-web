import { WhistoryComposed } from "@/app/[locale]/wallets/[id]/types";
import { getDictionary } from "@/dictionaries";
import { Locale } from "@/locale";

import { CurrencyComposedTableClient } from "./CurrencyComposedTableClient";
import Loading from "./Loading";

interface Props {
  locale: Locale;
  walletHistory: WhistoryComposed[];
}

export default async function CurrencyComposedTable({
  locale,
  walletHistory,
}: Props) {
  const d = await getDictionary(locale, "currencyPage.currencyTable");

  return (
    <div className="h-full w-full">
      {walletHistory && walletHistory.length > 0 ? (
        <CurrencyComposedTableClient
          dictionary={d}
          walletHistory={walletHistory}
        />
      ) : (
        <Loading d={d} />
      )}
    </div>
  );
}
