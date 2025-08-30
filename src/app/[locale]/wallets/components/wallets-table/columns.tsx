"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { Dictionary } from "@/dictionaries/locale";
import { Locale } from "@/locale";
import { formatDateDifference } from "@/shared/utils/time-utils";

import { ClientWalletDto } from "../../types";
import Changes from "../Changes";
import ActionsCell from "./ActionsCell";

export const createColumns = (
  locale: Locale,
  dictionary: Dictionary["walletsPage"]["walletsTable"],
): ColumnDef<ClientWalletDto>[] => {
  return [
    {
      accessorKey: "name",
      header: dictionary.name,
      cell: ({ row }) => {
        const wallet = row.original;
        return (
          <div className={`${wallet.deletedAt ? "opacity-30" : ""}`}>
            <Link href={`/wallets/${wallet.id}`} className="hover:underline">
              {wallet.name}
            </Link>
          </div>
        );
      },
    },
    {
      accessorKey: "balance",
      header: () => <div className="text-right">{dictionary.balance}</div>,
      cell: ({ row }) => {
        const wallet = row.original;
        return (
          <div className={`text-right ${wallet.deletedAt ? "opacity-30" : ""}`}>
            {wallet?.latestWhistory?.moneyAmount || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "currency",
      header: () => <div className="text-center">{dictionary.currency}</div>,
      cell: ({ row }) => {
        const wallet = row.original;
        return (
          <div
            className={`text-center ${wallet.deletedAt ? "opacity-30" : ""}`}
          >
            <Link
              href={`/currencies/${wallet.currency}`}
              className="hover:underline"
            >
              {wallet.currency}
            </Link>
          </div>
        );
      },
    },
    {
      accessorKey: "changes",
      header: () => <div className="text-center">{dictionary.changes}</div>,
      cell: ({ row }) => {
        const wallet = row.original;
        const changesText = wallet.changes
          ? `${(wallet.changesAbs || 0).toFixed(2)} (${((wallet.changes || 0) * 100).toFixed(2)}%)`
          : "";

        return (
          <div
            className={`text-center ${wallet.deletedAt ? "opacity-30" : ""}`}
          >
            <Changes
              text={changesText}
              isPositive={(wallet.changes || 0) >= 0}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "sinceLastReport",
      header: () => (
        <div className="text-center">{dictionary.sinceLastReport}</div>
      ),
      cell: ({ row }) => {
        const wallet = row.original;
        return (
          <div
            className={`text-center ${wallet.deletedAt ? "opacity-30" : ""}`}
          >
            {wallet.sinceLatestBallanceTs
              ? formatDateDifference(
                  {
                    days: wallet.sinceLatestBallanceTs.days,
                    hours: wallet.sinceLatestBallanceTs.hours,
                    minutes: wallet.sinceLatestBallanceTs.minutes,
                  },
                  locale,
                )
              : "-"}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">{dictionary.actions}</div>,
      cell: ({ row }) => (
        <ActionsCell wallet={row.original} dictionary={dictionary} />
      ),
    },
  ];
};
