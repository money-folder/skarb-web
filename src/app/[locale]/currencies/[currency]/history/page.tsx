import { Suspense } from "react";

import { getDictionary } from "@/dictionaries";
import { Locale } from "@/locale";

import CurrencyContainer from "./components/CurrencyContainer";
import HistoryFilters from "./components/HistoryFilters";

interface Props {
  params: Promise<{ currency: string; locale: Locale }>;
  searchParams: Promise<{ fromTs?: string; toTs?: string; dayStep?: string }>;
}

export default async function HistoryPage(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const { currency, locale } = params;

  const dHistoryFilters = await getDictionary(
    locale,
    "currencyPage.historyFilters",
  );

  return (
    <div className="grid h-full w-full grid-cols-[1fr,_1fr] grid-rows-[auto,_auto,_1fr] gap-x-5 overflow-hidden">
      <div className="col-span-2 row-span-1 flex h-full flex-col gap-5 overflow-hidden px-5 pt-5">
        <HistoryFilters dictionary={dHistoryFilters} />
        <Suspense fallback={null}>
          <CurrencyContainer
            locale={locale}
            currency={currency}
            fromTs={searchParams.fromTs ? +searchParams.fromTs : undefined}
            toTs={searchParams.toTs ? +searchParams.toTs : undefined}
            dayStep={searchParams.dayStep ? +searchParams.dayStep : undefined}
          />
        </Suspense>
      </div>
    </div>
  );
}
