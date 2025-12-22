import { getDictionary } from "@/dictionaries";
import { Locale } from "@/locale";

import { fetchWalletHistory } from "../../actions";
import { WalletHistoryTableClient } from "./WalletHistoryTableClient";
import WhistoryFilters from "./WhistoryFilters";
import WhistoryPagination from "./WhistoryPagination";

interface Props {
  locale: Locale;
  walletId: string;
  fromTs?: number;
  toTs?: number;
  page?: number;
  pageSize: number;
}

export default async function WhistoryTableContainer({
  locale,
  walletId,
  fromTs,
  toTs,
  page,
  pageSize,
}: Props) {
  const d = await getDictionary(locale, "whistoryPage");

  const { data: walletHistory } = await fetchWalletHistory(walletId, {
    fromTs,
    toTs,
    page,
    pageSize,
  });

  if (!walletHistory || !walletHistory.whistory) {
    return <p>{d.loadingWhistoryFailed}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <WhistoryFilters />
      <WalletHistoryTableClient
        dictionary={d.whistoryTable}
        whistory={walletHistory.whistory}
      />
      <WhistoryPagination
        currentPage={page || 1}
        totalItems={walletHistory.total}
        pageSize={pageSize}
      />
    </div>
  );
}
