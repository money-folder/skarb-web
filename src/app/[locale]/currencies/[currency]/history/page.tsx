import { Suspense } from "react";

import { Locale } from "@/locale";

import CurrencyContainer from "./components/CurrencyContainer";

interface Props {
  params: Promise<{ currency: string; locale: Locale }>;
  searchParams: Promise<{ dateFrom?: string; dateTo?: string }>;
}

export default async function HistoryPage(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const { currency, locale } = params;

  return (
    <div className="grid h-full w-full grid-cols-[1fr,_1fr] grid-rows-[auto,_auto,_1fr] gap-x-5 overflow-hidden">
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
