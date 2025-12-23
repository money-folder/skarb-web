import { WithMounted } from "@/shared/components/WithMounted";
import { fetchExpenses, fetchTypes } from "../actions";
import ExpensesCalendar from "./expenses-calendar/ExpensesCalendar";

interface Props {
  currency: string;
  fromTs?: number;
  toTs?: number;
}

export default async function ExpensesCalendarContainer({
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

  return (
    <WithMounted>
      <ExpensesCalendar expenses={expenses} currency={currency} types={types} />
    </WithMounted>
  );
}
