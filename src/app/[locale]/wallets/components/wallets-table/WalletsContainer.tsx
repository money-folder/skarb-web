import { fetchCurrentUserWallets } from "@/app/[locale]/wallets/actions";

import { Dictionary } from "@/dictionaries/locale";
import { Locale } from "@/locale";
import WalletsTable from "./WalletsTable";

interface Props {
  locale: Locale;
  d: Dictionary["walletsPage"];
}

export default async function WalletsContainer({ locale, d }: Props) {
  const result = await fetchCurrentUserWallets();

  return (
    <div>
      <div>
        {result.data ? (
          <WalletsTable
            locale={locale}
            d={d.walletsTable}
            wallets={result.data}
          />
        ) : (
          <p>{d.loadingWalletsFailed}</p>
        )}
      </div>
    </div>
  );
}
