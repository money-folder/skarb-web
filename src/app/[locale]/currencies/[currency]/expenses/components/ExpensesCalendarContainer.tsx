import { WithMounted } from "@/shared/components/WithMounted";
import type { Expense, ExpenseType } from "../actions";
import ExpensesCalendar from "./expenses-calendar/ExpensesCalendar";

interface Props {
  currency: string;
  fromTs?: number;
  toTs?: number;
  types?: string[];
  expenses: Expense[];
  allTypes: ExpenseType[];
}

export default async function ExpensesCalendarContainer({
  currency,
  expenses,
  allTypes,
}: Props) {
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
