import { fetchCurrentUserWallets } from "@/actions/wallets";

import WalletsTable from "./WalletsTable";

export default async function WalletsTableContainer() {
  const result = await fetchCurrentUserWallets();

  return result.data ? (
    <WalletsTable wallets={result.data} />
  ) : (
    <p>Loading wallets table failed 😢</p>
  );
}
