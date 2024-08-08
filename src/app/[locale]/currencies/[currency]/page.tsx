import { Suspense } from "react";
import CurrencyContainer from "./components/CurrencyContainer";

interface Props {
  params: { currency: string; locale: string };
}

export default async function CurrencyPage({ params: { currency } }: Props) {
  return (
    <main className="w-full h-full grid grid-cols-[1fr,_1fr] grid-rows-[auto,_auto,_1fr] gap-5 overflow-hidden">
      <h1 className="w-full col-span-3 row-span-1 text-center font-extrabold text-lg">
        {currency}
      </h1>

      <div className="mt-10 h-full row-span-1 col-span-2 flex gap-5 overflow-hidden">
        <Suspense fallback={null}>
          <CurrencyContainer currency={currency} />
        </Suspense>
      </div>
    </main>
  );
}
