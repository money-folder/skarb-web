import { Suspense } from "react";

import { Locale } from "@/locale";

import WalletHistoryTitle from "./components/title/WalletHistoryTitle";
import WalletHistoryTitleLoading from "./components/title/WalletHistoryTitleLoading";
import WhistoryChartContainer from "./components/whistory-chart/WhistoryChartContainer";
import WhistoryChartLoading from "./components/whistory-chart/WhistoryChartLoading";
import WhistoryTableContainer from "./components/whistory/WhistoryTableContainer";
import WhistoryTableLoading from "./components/whistory/WhistoryTableLoading";

interface Props {
  params: Promise<{ id: string; locale: Locale }>;
  searchParams: Promise<{
    fromTs?: string;
    toTs?: string;
    page?: string;
    detailization?: string;
  }>;
}

export default async function WalletHistory(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const { id, locale } = params;

  return (
    <main className="grid h-full w-full grid-cols-[1fr,_1fr] grid-rows-[auto,_1fr] gap-5 overflow-hidden">
      <Suspense fallback={<WalletHistoryTitleLoading />}>
        <WalletHistoryTitle locale={locale} walletId={id} />
      </Suspense>

      <div className="col-span-2 row-span-1 flex h-full gap-5 overflow-hidden">
        <div className="grid h-full w-full grid-cols-[1fr,_1fr] grid-rows-[auto] gap-5 p-1">
          <div className="col-span-1 row-span-1 flex h-full w-full max-w-[550px] flex-col overflow-auto">
            <Suspense
              key={`${searchParams.fromTs}-${searchParams.toTs}-${searchParams.page}`}
              fallback={<WhistoryTableLoading />}
            >
              <WhistoryTableContainer
                locale={locale}
                walletId={id}
                fromTs={searchParams.fromTs ? +searchParams.fromTs : undefined}
                toTs={searchParams.toTs ? +searchParams.toTs : undefined}
                page={searchParams.page ? +searchParams.page : undefined}
                pageSize={10}
              />
            </Suspense>
          </div>

          <div className="h-full w-full overflow-y-auto p-1">
            <div className="col-span-1 row-span-1 flex h-full w-full flex-col justify-between">
              <Suspense
                key={`${searchParams.fromTs}-${searchParams.toTs}-${searchParams.detailization}`}
                fallback={<WhistoryChartLoading />}
              >
                <WhistoryChartContainer
                  locale={locale}
                  walletId={id}
                  fromTs={
                    searchParams.fromTs ? +searchParams.fromTs : undefined
                  }
                  toTs={searchParams.toTs ? +searchParams.toTs : undefined}
                  detailization={
                    searchParams.detailization
                      ? +searchParams.detailization
                      : undefined
                  }
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
