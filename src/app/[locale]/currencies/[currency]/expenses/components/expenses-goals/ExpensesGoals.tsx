"use client";

import { useContext } from "react";

import { DictionaryContext } from "@/shared/components/Dictionary";

import { ExpenseGoal } from "../../actions";
import CreateExpenseGoalButton from "./create-goal/CreateExpenseGoalButton";
import ExpensesGoalProgress from "./goal-progress/ExpenseGoalProgress";

interface Props {
  readonly currency: string;
  readonly types: string[];
  readonly expensesGoals: ExpenseGoal[];
}

export default function ExpensesGoals({
  currency,
  types,
  expensesGoals,
}: Props) {
  const { d } = useContext(DictionaryContext);

  return (
    <div className="flex w-full flex-col items-start justify-start">
      <CreateExpenseGoalButton
        text={d.currencyPage.expensesContainer.createButtonLabel}
        currency={currency}
        types={types}
      />
      <div className="mt-4 w-full pr-4">
        <ul className="grid w-full grid-flow-row auto-rows-max grid-cols-[repeat(2,1fr)] gap-4">
          {expensesGoals.map((goal) => (
            <li key={goal.id} className="h-full">
              <ExpensesGoalProgress expensesGoal={goal} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
