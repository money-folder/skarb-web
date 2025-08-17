"use client";

import { ColumnDef } from "@tanstack/react-table";

import { WhistoryComposed } from "@/app/[locale]/wallets/[id]/types";
import Changes from "@/app/[locale]/wallets/components/Changes";
import { Dictionary } from "@/dictionaries/locale";

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
      accessorKey: "wallets",
      header: () => <div className="text-left">{dictionary.wallets}</div>,
      cell: ({ row }) => {
        const wh = row.original;
        return (
          <div className="text-left">
            <ul className="list-disc pl-5">
              {wh.whistories.map((wh2) => (
                <li
                  key={wh2.id}
                >{`${wh2.wallet.name} (${wh2.moneyAmount})`}</li>
              ))}
            </ul>
          </div>
        );
      },
    },
    {
      accessorKey: "date",
      header: () => <div className="text-center">{dictionary.date}</div>,
      cell: ({ row }) => {
        const wh = row.original;
        return <div className="text-center">{wh.date.toLocaleString()}</div>;
      },
    },
  ];
};
