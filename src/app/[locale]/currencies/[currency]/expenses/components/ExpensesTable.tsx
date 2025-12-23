import { getDictionary } from "@/dictionaries";
import { Locale } from "@/locale";

import { ClientExpenseDto } from "../types";
import { GroupedExpensesTableClient } from "./expenses-table/GroupedExpensesTableClient";

interface Props {
  locale: Locale;
  expenses: ClientExpenseDto[];
  currency: string;
  types?: string[];
}

export default async function ExpensesTable({
  locale,
  expenses = [],
  currency,
  types = [],
}: Props) {
  const d = await getDictionary(locale, "currencyPage.expensesTable");

  return (
    <div className="h-full w-full">
      <GroupedExpensesTableClient
        dictionary={d}
        expenses={expenses}
        currency={currency}
        types={types}
      />
    </div>
  );
}
