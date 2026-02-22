import { WithMounted } from "@/shared/components/WithMounted";
import { fetchExpenseGoals, type ExpenseType } from "../actions";
import ExpensesGoals from "./expenses-goals/ExpensesGoals";

interface Props {
  currency: string;
  allTypes: ExpenseType[];
  fromTs?: number;
}

export default async function ExpensesGoalsContainer({
  currency,
  allTypes,
  fromTs,
}: Props) {
  const { data: expensesGoals } = await fetchExpenseGoals(currency, fromTs);

  return (
    <WithMounted>
      <ExpensesGoals
        currency={currency}
        types={allTypes}
        expensesGoals={expensesGoals}
      />
    </WithMounted>
  );
}
