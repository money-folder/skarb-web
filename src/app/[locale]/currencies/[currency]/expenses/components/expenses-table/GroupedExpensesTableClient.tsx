"use client";

import { useMemo } from "react";

import { Dictionary } from "@/dictionaries/locale";

import { ClientExpenseDto } from "../../types";
import { groupExpensesByDay } from "../../utils";
import DayExpenseGroup from "./DayExpenseGroup";

interface Props {
  dictionary: Dictionary["currencyPage"]["expensesTable"];
  expenses: ClientExpenseDto[];
  currency: string;
  types: string[];
}

export const GroupedExpensesTableClient = ({
  dictionary,
  expenses,
  currency,
  types,
}: Props) => {
  // Group expenses by day
  const groupedExpenses = useMemo(
    () => groupExpensesByDay(expenses),
    [expenses],
  );

  return (
    <div className="space-y-4">
      {groupedExpenses.map(({ date, expenses, totalAmount }) => (
        <DayExpenseGroup
          key={date}
          date={date}
          expenses={expenses}
          totalAmount={totalAmount}
          currency={currency}
          dictionary={dictionary}
          types={types}
          initialExpanded
        />
      ))}
    </div>
  );
};
