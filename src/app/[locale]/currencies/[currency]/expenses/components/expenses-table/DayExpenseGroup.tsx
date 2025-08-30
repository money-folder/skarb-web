"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

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

interface DayExpenseGroupProps {
  date: string;
  expenses: ClientExpenseDto[];
  totalAmount: number;
  currency: string;
  dictionary: Dictionary["currencyPage"]["expensesTable"];
  initialExpanded?: boolean;
}

const DayExpenseGroup = ({
  date,
  expenses,
  totalAmount,
  currency,
  dictionary,
  initialExpanded = false,
}: DayExpenseGroupProps) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const toggleExpansion = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="overflow-hidden rounded-md border">
      <div
        className="flex cursor-pointer items-center justify-between bg-muted p-2"
        onClick={toggleExpansion}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
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

      {isExpanded && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">{dictionary.type}</TableHead>
              <TableHead className="text-right">
                {dictionary.moneyAmount}
              </TableHead>
              <TableHead className="text-center">{dictionary.date}</TableHead>
              <TableHead className="text-left">{dictionary.comment}</TableHead>
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
  );
};

export default DayExpenseGroup;
