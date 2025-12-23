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
  types?: string[];
  comment?: string;
}

export default async function ExpensesTableContainer({
  locale,
  currency,
  fromTs,
  toTs,
  types,
  comment,
}: Props) {
  const [{ data: expenses }, { data: allTypes }] = await Promise.all([
    fetchExpenses(currency, {
      fromTs,
      toTs,
      types,
      comment,
    }),
    fetchTypes(currency),
  ]);

  const d = (await getDictionary(
    locale,
    "currencyPage.expensesContainer",
  )) as ExpensesContainerDictionary;

  if (!expenses?.length || !allTypes?.length) {
    console.warn("Either expenses or types are empty", {
      expenses,
      types: allTypes,
      fromTs,
      toTs,
    });
    return <p>{d.noExpenses}</p>;
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
