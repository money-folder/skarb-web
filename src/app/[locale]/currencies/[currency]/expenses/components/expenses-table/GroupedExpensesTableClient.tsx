"use client";

import { useMemo } from "react";

import { Dictionary } from "@/dictionaries/locale";

import { ClientExpenseDto } from "../../types";
import DayExpenseGroup from "./DayExpenseGroup";

interface Props {
  dictionary: Dictionary["currencyPage"]["expensesTable"];
  expenses: ClientExpenseDto[];
  currency: string;
}

// Helper function to group expenses by day
const groupExpensesByDay = (expenses: ClientExpenseDto[]) => {
  const groupedExpenses: Record<string, ClientExpenseDto[]> = {};

  expenses.forEach((expense) => {
    const dateStr = expense.date.toLocaleDateString();
    if (!groupedExpenses[dateStr]) {
      groupedExpenses[dateStr] = [];
    }
    groupedExpenses[dateStr].push(expense);
  });

  // Sort dates in descending order (newest first)
  return Object.entries(groupedExpenses)
    .sort(([dateA], [dateB]) => {
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    })
    .map(([date, expenses]) => ({
      date,
      expenses,
      totalAmount: expenses.reduce(
        (sum, expense) => sum + expense.moneyAmount,
        0,
      ),
    }));
};

export const GroupedExpensesTableClient = ({
  dictionary,
  expenses,
  currency,
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
        />
      ))}
    </div>
  );
};
