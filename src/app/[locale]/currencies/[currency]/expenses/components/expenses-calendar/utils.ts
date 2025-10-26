import { ClientExpenseDto } from "../../types";

interface DayExpenses {
  date: Date;
  expenses: ClientExpenseDto[];
  totalAmount: number;
}

export const groupExpensesByDay = (
  expenses: ClientExpenseDto[],
): DayExpenses[] => {
  const grouped = expenses.reduce<Record<string, DayExpenses>>(
    (acc, expense) => {
      const date = new Date(expense.date);
      date.setHours(0, 0, 0, 0);
      const dateKey = date.toISOString();

      if (!acc[dateKey]) {
        acc[dateKey] = {
          date,
          expenses: [],
          totalAmount: 0,
        };
      }

      acc[dateKey].expenses.push(expense);
      acc[dateKey].totalAmount += expense.moneyAmount;

      return acc;
    },
    {},
  );

  return Object.values(grouped).sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );
};

export const getDateSpan = (
  expenses: ClientExpenseDto[],
): { start: Date; end: Date } => {
  if (!expenses.length) {
    const today = new Date();
    return { start: today, end: today };
  }

  const dates = expenses.map((expense) => new Date(expense.date));
  const start = new Date(Math.min(...dates.map((d) => d.getTime())));
  const end = new Date(Math.max(...dates.map((d) => d.getTime())));

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  return { start, end };
};

export const generateMonthsInRange = (start: Date, end: Date): Date[] => {
  const months: Date[] = [];
  const current = new Date(start);
  current.setDate(1);

  while (current <= end) {
    months.push(new Date(current));
    current.setMonth(current.getMonth() + 1);
  }

  return months;
};
