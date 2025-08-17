"use client";

import { Dictionary } from "@/dictionaries/locale";
import { ColumnDef } from "@tanstack/react-table";
import { ClientExpenseDto } from "../../types";
import DestroyButton from "../buttons/DestroyButton";

export const createColumns = (
  dictionary: Dictionary["currencyPage"]["expensesTable"],
  currency: string,
): ColumnDef<ClientExpenseDto>[] => {
  return [
    {
      accessorKey: "type",
      header: () => <div className="text-left">{dictionary.type}</div>,
      cell: ({ row }) => {
        const expense = row.original;
        return (
          <div className={`text-left ${expense.deletedAt ? "opacity-30" : ""}`}>
            {expense.type}
          </div>
        );
      },
    },
    {
      accessorKey: "moneyAmount",
      header: () => <div className="text-right">{dictionary.moneyAmount}</div>,
      cell: ({ row }) => {
        const expense = row.original;
        return (
          <div
            className={`text-right ${expense.deletedAt ? "opacity-30" : ""}`}
          >
            {expense.moneyAmount}
          </div>
        );
      },
    },
    {
      accessorKey: "date",
      header: () => <div className="text-center">{dictionary.date}</div>,
      cell: ({ row }) => {
        const expense = row.original;
        return (
          <div
            className={`text-center ${expense.deletedAt ? "opacity-30" : ""}`}
          >
            {expense.date.toLocaleString().split(", ")[0]}
          </div>
        );
      },
    },
    {
      accessorKey: "comment",
      header: () => <div className="text-left">{dictionary.comment}</div>,
      cell: ({ row }) => {
        const expense = row.original;
        return (
          <div className={`text-left ${expense.deletedAt ? "opacity-30" : ""}`}>
            {expense.comment || "-"}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">{dictionary.actions}</div>,
      cell: ({ row }) => {
        const expense = row.original;
        return (
          <div className="flex justify-center">
            <DestroyButton id={expense.id} currency={currency} />
          </div>
        );
      },
    },
  ];
};
