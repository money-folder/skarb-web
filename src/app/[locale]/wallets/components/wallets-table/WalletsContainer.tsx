import { fetchCurrentUserWallets } from "@/app/[locale]/wallets/actions";

import { getDictionary } from "@/dictionaries";
import { Locale } from "@/locale";
import WalletsTable from "./WalletsTable";

interface Props {
  locale: Locale;
}

export default async function WalletsContainer({ locale }: Props) {
  const result = await fetchCurrentUserWallets();

  const d = await getDictionary(locale, "walletsPage");

  return (
    <div>
      <div>
        {result.data ? (
          <WalletsTable locale={locale} wallets={result.data} />
        ) : (
          <p>{d.loadingWalletsFailed}</p>
        )}
      </div>
    </div>
  );
}
