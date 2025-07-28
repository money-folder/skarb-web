import { Suspense } from "react";

import { Locale } from "@/locale";

import CurrencyComposedFilters from "./components/CurrencyComposedFilters";
import CurrencyContainer from "./components/CurrencyContainer";

interface Props {
  params: { currency: string; locale: Locale };
  searchParams: { dateFrom?: string; dateTo?: string };
}

export default async function HistoryPage({
  params: { currency, locale },
  searchParams,
}: Props) {
  return (
    <div className="grid h-full w-full grid-cols-[1fr,_1fr] grid-rows-[auto,_auto,_1fr] gap-x-5 overflow-hidden">
      <div className="col-span-2 row-span-1 flex w-full items-center justify-start rounded-lg bg-gray-200 p-2">
        <CurrencyComposedFilters />
      </div>

      <div className="col-span-2 row-span-1 flex h-full gap-5 overflow-hidden pt-5">
        <Suspense fallback={null}>
          <CurrencyContainer
            locale={locale}
            currency={currency}
            fromTs={searchParams.dateFrom ? +searchParams.dateFrom : undefined}
            toTs={searchParams.dateTo ? +searchParams.dateTo : undefined}
          />
        </Suspense>
      </div>
    </div>
  );
}
