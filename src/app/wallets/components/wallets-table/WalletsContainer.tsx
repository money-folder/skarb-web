import { fetchCurrentUserWallets } from "@/actions/wallets";

import WalletsTable from "./WalletsTable";
import { groupByCurrency } from "@/utils/wallets-utils";
import WalletsSummaryCard from "@/widgets/WalletsSummaryCard";

export default async function WalletsContainer() {
  const result = await fetchCurrentUserWallets();

  const summaryList = groupByCurrency(result.data || []);
  const showSummary = result?.data?.length && result.data.length > 1;

  return (
    <div>
      {showSummary ? (
        <div className="flex justify-start">
          <WalletsSummaryCard summaryList={summaryList} />
        </div>
      ) : null}

      <div className={`${showSummary ? "mt-10" : ""}`}>
        {result.data ? (
          <WalletsTable wallets={result.data} />
        ) : (
          <p>Loading wallets table failed 😢</p>
        )}
      </div>
    </div>
  );
}
