"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dictionary } from "@/dictionaries/locale";

import { ClientExpenseDto } from "../../types";
import DestroyButton from "../buttons/DestroyButton";

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
  // State to track which day groups are expanded
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});

  // Group expenses by day
  const groupedExpenses = useMemo(
    () => groupExpensesByDay(expenses),
    [expenses],
  );

  // Toggle a day's expanded state
  const toggleDayExpansion = (date: string) => {
    setExpandedDays((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  return (
    <div className="space-y-4">
      {groupedExpenses.map(({ date, expenses, totalAmount }) => (
        <div key={date} className="overflow-hidden rounded-md border">
          <div
            className="flex cursor-pointer items-center justify-between bg-muted p-2"
            onClick={() => toggleDayExpansion(date)}
          >
            <div className="flex items-center gap-2">
              {expandedDays[date] ? (
                <ChevronDown size={20} />
              ) : (
                <ChevronRight size={20} />
              )}
              <h3 className="font-medium">{date}</h3>
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <span>
                {totalAmount.toFixed(2)} {currency}
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 text-xs">
                {expenses.length}
              </span>
            </div>
          </div>

          {expandedDays[date] && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">{dictionary.type}</TableHead>
                  <TableHead className="text-right">
                    {dictionary.moneyAmount}
                  </TableHead>
                  <TableHead className="text-center">
                    {dictionary.date}
                  </TableHead>
                  <TableHead className="text-left">
                    {dictionary.comment}
                  </TableHead>
                  <TableHead className="text-center">
                    {dictionary.actions}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell
                      className={`text-left ${expense.deletedAt ? "opacity-30" : ""}`}
                    >
                      {expense.type}
                    </TableCell>
                    <TableCell
                      className={`text-right ${expense.deletedAt ? "opacity-30" : ""}`}
                    >
                      {expense.moneyAmount}
                    </TableCell>
                    <TableCell
                      className={`text-center ${expense.deletedAt ? "opacity-30" : ""}`}
                    >
                      {expense.date.toLocaleString().split(", ")[0]}
                    </TableCell>
                    <TableCell
                      className={`text-left ${expense.deletedAt ? "opacity-30" : ""}`}
                    >
                      {expense.comment || "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <DestroyButton id={expense.id} currency={currency} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      ))}
    </div>
  );
};
