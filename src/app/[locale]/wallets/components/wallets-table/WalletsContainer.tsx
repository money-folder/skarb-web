import { fetchCurrentUserWallets } from "@/actions/wallets";

import WalletsTable from "./WalletsTable";
import { Dictionary } from "@/types/locale";

interface Props {
  locale: string;
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
