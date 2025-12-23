import { WithMounted } from "@/shared/components/WithMounted";
import { fetchExpenses, fetchTypes } from "../actions";
import ExpensesCalendar from "./expenses-calendar/ExpensesCalendar";

interface Props {
  currency: string;
  fromTs?: number;
  toTs?: number;
  types?: string[];
}

export default async function ExpensesCalendarContainer({
  currency,
  fromTs,
  toTs,
  types,
}: Props) {
  const [{ data: expenses }, { data: allTypes }] = await Promise.all([
    fetchExpenses(currency, {
      fromTs,
      toTs,
      types,
    }),
    fetchTypes(currency),
  ]);

  return (
    <WithMounted>
      <ExpensesCalendar
        expenses={expenses}
        currency={currency}
        types={allTypes}
      />
    </WithMounted>
  );
}
