import { fetchWalletHistory } from '@/actions/wallet-history';
import WalletHistoryChart from '@/widgets/wallet-history-chart/WalletHistoryChart';
import WhistoryChangesChart from '@/widgets/whistory-changes-chart/WhistoryChangesChart';
import { WithMounted } from '@/components/WithMounted';
import WalletChangesSummaryCard from '@/components/cards/WalletChangesSummaryCard';

import WalletHistoryTable from './WalletHistoryTable';
import { Dictionary } from '@/types/locale';
import WhistoryEntriesSummaryCard from '@/components/cards/WhistoryEntriesSummaryCard';

interface WalletHistoryContainerProps {
  d: Dictionary['whistoryPage'];
  locale: string;
  walletId: string;
  fromTs?: number;
  toTs?: number;
}

export default async function WalletHistoryContainer({
  d,
  locale,
  walletId,
  fromTs,
  toTs,
}: WalletHistoryContainerProps) {
  const { data: walletHistory } = await fetchWalletHistory(walletId, {
    fromTs,
    toTs,
  });

  return walletHistory ? (
    <div className="grid h-full w-full grid-cols-[1fr,_1fr] grid-rows-[auto,_1fr] gap-5">
      <div className="col-span-2 row-span-1 flex gap-5">
        <WalletChangesSummaryCard
          text={d.cards.walletChangesSummary.title}
          increases={walletHistory.increasesSum}
          decreases={walletHistory.decreasesSum}
          diff={walletHistory.increasesDecreasesDiff}
        />

        {walletHistory.whistory.length ? (
          <WhistoryEntriesSummaryCard
            locale={locale}
            d={d.cards.whistoryEntriesSummary}
            startDate={walletHistory.whistory[0].date}
            endDate={walletHistory.whistory[walletHistory.whistory.length - 1].date}
            entriesCount={walletHistory.whistory.length}
          />
        ) : null}
      </div>

      <div className="col-span-1 row-span-1 flex h-full w-full max-w-[550px] flex-col overflow-auto">
        {walletHistory.whistory.length ? (
          <WalletHistoryTable d={d.whistoryTable} walletHistory={walletHistory.whistory} />
        ) : (
          <p>{d.whistoryEmpty}</p>
        )}
      </div>

      <div className="h-full w-full overflow-y-auto">
        <div className="col-span-1 row-span-1 flex h-full w-full justify-between max-[1875px]:flex-col">
          {walletHistory.whistory.length > 1 ? (
            <>
              <WithMounted>
                <WalletHistoryChart width={525} height={300} list={walletHistory.whistory} />
              </WithMounted>

              <WithMounted>
                <WhistoryChangesChart width={525} height={300} list={walletHistory.whistory} />
              </WithMounted>
            </>
          ) : (
            <p>{d.notEnoughDataForChart}</p>
          )}
        </div>
      </div>
    </div>
  ) : (
    <p>Wallet History fetch failed 😢</p>
  );
}
