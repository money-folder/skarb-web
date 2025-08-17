import { getDictionary } from "@/dictionaries";
import { Locale } from "@/locale";
import { ClientExpenseDto } from "../types";
import { ExpensesTableClient } from "./expenses-table/ExpensesTableClient";
import Loading from "./expenses-table/Loading";

interface Props {
  locale: Locale;
  expenses: ClientExpenseDto[];
  currency: string;
}

export default async function ExpensesTable({
  locale,
  expenses,
  currency,
}: Props) {
  const d = await getDictionary(locale, "currencyPage.expensesTable");

  return (
    <div className="h-full w-full">
      {expenses && expenses.length > 0 ? (
        <ExpensesTableClient
          dictionary={d}
          expenses={expenses}
          currency={currency}
        />
      ) : (
        <Loading d={d} />
      )}
    </div>
  );
}
