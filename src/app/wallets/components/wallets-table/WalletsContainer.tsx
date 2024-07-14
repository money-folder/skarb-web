import { fetchCurrentUserWallets } from "@/actions/wallets";

import WalletsTable from "./WalletsTable";

export default async function WalletsContainer() {
  const result = await fetchCurrentUserWallets();

  return (
    <div>
      <div>
        {result.data ? (
          <WalletsTable wallets={result.data} />
        ) : (
          <p>Loading wallets table failed 😢</p>
        )}
      </div>
    </div>
  );
}
