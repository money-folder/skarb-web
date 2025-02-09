import { getDictionary } from "@/dictionaries";
import { Locale } from "@/locale";
import { Suspense } from "react";
import CurrencyComposedFilters from "./components/CurrencyComposedFilters";
import CurrencyContainer from "./components/CurrencyContainer";

interface Props {
  params: { currency: string; locale: Locale };
  searchParams: { dateFrom?: string; dateTo?: string };
}

export default async function CurrencyPage({
  params: { currency, locale },
  searchParams,
}: Props) {
  const d = await getDictionary(locale);

  return (
    <main className="grid h-full w-full grid-cols-[1fr,_1fr] grid-rows-[auto,_auto,_1fr] gap-5 overflow-hidden">
      <h1 className="col-span-3 row-span-1 w-full text-center text-lg font-extrabold">
        {currency}
      </h1>

      <div className="col-span-2 row-span-1 flex w-full items-center justify-start rounded-lg bg-gray-200 p-2">
        <CurrencyComposedFilters />
      </div>

      <div className="col-span-2 row-span-1 flex h-full gap-5 overflow-hidden">
        <Suspense fallback={null}>
          <CurrencyContainer
            d={d.currencyPage}
            currency={currency}
            fromTs={searchParams.dateFrom ? +searchParams.dateFrom : undefined}
            toTs={searchParams.dateTo ? +searchParams.dateTo : undefined}
          />
        </Suspense>
      </div>
    </main>
  );
}
