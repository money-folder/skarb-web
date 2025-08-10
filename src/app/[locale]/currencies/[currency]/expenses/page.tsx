import { Locale } from "@/locale";
import ExpensesComposedFilters from "./components/ExpensesComposedFilters";
import ExpensesContainer from "./components/ExpensesContainer";

interface Props {
  params: {
    locale: Locale;
    currency: string;
  };
  searchParams: { dateFrom?: string; dateTo?: string };
}

export default async function ExpensesPage({
  params: { locale, currency },
  searchParams,
}: Props) {
  return (
    <div className="grid h-full w-full overflow-hidden">
      <div className="flex h-fit w-full items-center justify-start rounded-lg bg-gray-200 p-2">
        <ExpensesComposedFilters />
      </div>

      <div className="flex h-full overflow-hidden pt-5">
        <ExpensesContainer
          locale={locale}
          currency={currency}
          fromTs={searchParams.dateFrom ? +searchParams.dateFrom : undefined}
          toTs={searchParams.dateTo ? +searchParams.dateTo : undefined}
        />
      </div>
    </div>
  );
}
