import { getDictionary } from "@/dictionaries";
import { Locale } from "@/locale";
import { fetchExpenses, fetchTypes } from "../actions";
import { ExpensesContainerDictionary } from "./dictionary";
import ExpensesTable from "./ExpensesTable";

interface Props {
  locale: Locale;
  currency: string;
  fromTs?: number;
  toTs?: number;
}

export default async function ExpensesTableContainer({
  locale,
  currency,
  fromTs,
  toTs,
}: Props) {
  const [{ data: expenses }, { data: types }] = await Promise.all([
    fetchExpenses(currency, {
      fromTs,
      toTs,
    }),
    fetchTypes(currency),
  ]);

  const d = (await getDictionary(
    locale,
    "currencyPage.expensesContainer",
  )) as ExpensesContainerDictionary;

  if (!expenses?.length || !types?.length) {
    console.warn("Either expenses or types are empty", {
      expenses,
      types,
      fromTs,
      toTs,
    });
    return <p>{d.noExpenses}</p>;
  }

  return (
    <ExpensesTable
      locale={locale}
      expenses={expenses}
      types={types}
      currency={currency}
    />
  );
}
