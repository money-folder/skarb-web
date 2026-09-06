import { WithMounted } from "@/shared/components/WithMounted";

import { fetchExpenseGoals } from "../actions";
import ExpensesGoals from "./ExpensesGoals";

interface Props {
  currency: string;
  allTypes: string[];
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
