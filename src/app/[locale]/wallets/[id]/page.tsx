import { Suspense } from 'react';

import WalletHistoryContainer from './components/wallet-history/WalletHistoryContainer';
import Loading from './components/wallet-history/Loading';
import WalletHistoryFilters from './components/WalletHistoryFilters';
import { getDictionary } from '@/dictionaries';
import WalletHistoryTitle from './components/title/WalletHistoryTitle';
import WalletHistoryTitleLoading from './components/title/WalletHistoryTitleLoading';

interface Props {
  params: { id: string; locale: string };
  searchParams: { whistoryFrom?: string; whistoryTo?: string };
}

export default async function WalletHistory({ params: { id, locale }, searchParams }: Props) {
  const d = await getDictionary(locale);

  return (
    <main className="grid h-full w-full grid-cols-[1fr,_1fr] grid-rows-[auto,_auto,_1fr] gap-5 overflow-hidden">
      <Suspense fallback={<WalletHistoryTitleLoading />}>
        <WalletHistoryTitle pageTitleTemplate={d.whistoryPage.title} walletId={id} />
      </Suspense>

      <div className="col-span-3 row-span-1 flex w-full items-center justify-center rounded-lg bg-gray-200 p-2">
        <WalletHistoryFilters d={d.whistoryPage.filters} />
      </div>

      <div className="col-span-2 row-span-1 flex h-full gap-5 overflow-hidden">
        <Suspense fallback={<Loading />}>
          <WalletHistoryContainer
            locale={locale}
            d={d.whistoryPage}
            walletId={id}
            fromTs={searchParams.whistoryFrom ? +searchParams.whistoryFrom : undefined}
            toTs={searchParams.whistoryTo ? +searchParams.whistoryTo : undefined}
          />
        </Suspense>
      </div>
    </main>
  );
}
