import { fetchCurrentUserWallets } from "@/app/[locale]/wallets/actions";
import { getDictionary } from "@/dictionaries";
import { Locale } from "@/locale";

import { WalletsTableClient } from "./WalletsTableClient";

interface Props {
  locale: Locale;
}

export default async function WalletsContainer({ locale }: Props) {
  const d = await getDictionary(locale, "walletsPage");
  const result = await fetchCurrentUserWallets();

  return (
    <div>
      {result.data ? (
        <WalletsTableClient
          locale={locale}
          wallets={result.data}
          dictionary={d.walletsTable}
        />
      ) : (
        <p>{d.loadingWalletsFailed}</p>
      )}
    </div>
  );
}
