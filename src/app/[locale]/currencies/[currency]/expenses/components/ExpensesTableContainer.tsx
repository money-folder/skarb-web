import { Locale } from "@/locale";
import type { Expense, ExpenseType } from "../actions";
import ExpensesTable from "./ExpensesTable";

interface Props {
  locale: Locale;
  currency: string;
  fromTs?: number;
  toTs?: number;
  types?: string[];
  expenses: Expense[];
  allTypes: ExpenseType[];
}

export default async function ExpensesTableContainer({
  locale,
  currency,
  fromTs,
  toTs,
  types,
  expenses,
  allTypes,
}: Props) {
  if (!types?.length) {
    console.warn("Types are empty", {
      expenses,
      types: allTypes,
      fromTs,
      toTs,
    });
  }

  if (!expenses?.length) {
    console.warn("Expenses are empty", {
      expenses,
      types: allTypes,
      fromTs,
      toTs,
    });
  }

  return (
    <ExpensesTable
      locale={locale}
      expenses={expenses}
      types={allTypes}
      currency={currency}
    />
  );
}
