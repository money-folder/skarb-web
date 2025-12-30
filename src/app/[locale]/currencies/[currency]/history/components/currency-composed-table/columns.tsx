"use client";

import { ColumnDef } from "@tanstack/react-table";

import { WhistoryComposed } from "@/app/[locale]/wallets/[id]/types";
import Changes from "@/app/[locale]/wallets/components/Changes";
import { Dictionary } from "@/dictionaries/locale";
import { formatDateOnly } from "@/shared/utils/time-utils";

import { ActionsCell } from "./ActionsCell";

export const createColumns = (
  dictionary: Dictionary["currencyPage"]["currencyTable"],
): ColumnDef<WhistoryComposed>[] => {
  return [
    {
      accessorKey: "moneyAmount",
      header: () => <div className="text-right">{dictionary.moneyAmount}</div>,
      cell: ({ row }) => {
        const wh = row.original;
        return <div className="text-right">{wh.moneyAmount}</div>;
      },
    },
    {
      accessorKey: "changes",
      header: () => <div className="text-center">{dictionary.changes}</div>,
      cell: ({ row }) => {
        const wh = row.original;
        const changesText = wh.changes
          ? `${(wh.changesAbs || 0).toFixed(2)} (${((wh.changes || 0) * 100).toFixed(2)}%)`
          : "";

        return (
          <div className="text-center">
            <Changes text={changesText} isPositive={(wh.changes || 0) > 0} />
          </div>
        );
      },
    },
    {
      accessorKey: "date",
      header: () => <div className="text-center">{dictionary.date}</div>,
      cell: ({ row }) => {
        const wh = row.original;
        return <div className="text-center">{formatDateOnly(wh.date)}</div>;
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">{dictionary.actions}</div>,
      cell: ({ row }) => {
        const entry = row.original;
        return <ActionsCell entry={entry} dictionary={dictionary} />;
      },
    },
  ];
};
