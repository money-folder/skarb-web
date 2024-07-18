import { fetchCurrentUserWallets } from "@/actions/wallets";

import WalletsTable from "./WalletsTable";
import { Dictionary } from "@/types/locale";

interface Props {
  d: Dictionary["walletsPage"];
}

export default async function WalletsContainer({ d }: Props) {
  const result = await fetchCurrentUserWallets();

  return (
    <div>
      <div>
        {result.data ? (
          <WalletsTable d={d.walletsTable} wallets={result.data} />
        ) : (
          <p>{d.loadingWalletsFailed}</p>
        )}
      </div>
    </div>
  );
}
