import { Locale } from "@/locale";

import ExpensesContainer from "./components/ExpensesContainer";

interface Props {
  params: Promise<{
    locale: Locale;
    currency: string;
  }>;
  searchParams: Promise<{
    fromTs?: string;
    toTs?: string;
    types?: string;
    comment?: string;
  }>;
}

export default async function ExpensesPage(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const { locale, currency } = params;

  return (
    <div className="grid h-full w-full grid-cols-[1fr,_1fr] grid-rows-[auto,_1fr] gap-x-5 overflow-hidden">
      <div className="col-span-2 row-span-1 flex h-full overflow-hidden pt-5">
        <ExpensesContainer
          locale={locale}
          currency={currency}
          fromTs={searchParams.fromTs ? +searchParams.fromTs : undefined}
          toTs={searchParams.toTs ? +searchParams.toTs : undefined}
          types={searchParams.types ? searchParams.types.split(",") : undefined}
          comment={searchParams.comment}
        />
      </div>
    </div>
  );
}
