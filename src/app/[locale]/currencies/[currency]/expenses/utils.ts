import { ClientExpenseDto } from "./types";

export const groupExpensesByDay = (expenses: ClientExpenseDto[]) => {
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
