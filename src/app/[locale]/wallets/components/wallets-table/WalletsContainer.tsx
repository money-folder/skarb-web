import { fetchCurrentUserWallets } from "@/app/[locale]/wallets/actions";
import { getServerLocale } from "@/getServerLocale";

import { getDictionary } from "@/dictionaries";
import WalletsTable from "./WalletsTable";

export default async function WalletsContainer() {
  const result = await fetchCurrentUserWallets();

  const locale = getServerLocale();
  const d = await getDictionary(locale, "walletsPage");

  return (
    <div>
      <div>
        {result.data ? (
          <WalletsTable wallets={result.data} />
        ) : (
          <p>{d.loadingWalletsFailed}</p>
        )}
      </div>
    </div>
  );
}
