import { Suspense } from "react";
import CurrencyContainer from "./components/CurrencyContainer";
import CurrencyComposedFilters from "./components/CurrencyComposedFilters";
import { getDictionary } from "@/dictionaries";

interface Props {
  params: { currency: string; locale: string };
  searchParams: { dateFrom?: string; dateTo?: string };
}

export default async function CurrencyPage({
  params: { currency, locale },
  searchParams,
}: Props) {
  const d = await getDictionary(locale);

  return (
    <main className="w-full h-full grid grid-cols-[1fr,_1fr] grid-rows-[auto,_auto,_1fr] gap-5 overflow-hidden">
      <h1 className="w-full col-span-3 row-span-1 text-center font-extrabold text-lg">
        {currency}
      </h1>

      <div className="p-2 w-full flex justify-start items-center col-span-2 row-span-1 bg-gray-200 rounded-lg">
        <CurrencyComposedFilters />
      </div>

      <div className="h-full row-span-1 col-span-2 flex gap-5 overflow-hidden">
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
