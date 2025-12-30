"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MessageSquare } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dictionary } from "@/dictionaries/locale";
import { formatDateOnly } from "@/shared/utils/time-utils";

import Changes from "../../../../wallets/components/Changes";
import { ClientWhistoryDto } from "../../types";
import { ActionsCell } from "./ActionsCell";

export const createColumns = (
  dictionary: Dictionary["whistoryPage"]["whistoryTable"],
): ColumnDef<ClientWhistoryDto>[] => {
  return [
    {
      accessorKey: "moneyAmount",
      header: () => (
        <div className="w-3/12 text-right">{dictionary.balance}</div>
      ),
      cell: ({ row }) => {
        const whistory = row.original;
        return (
          <div
            className={`w-3/12 text-right ${whistory.deletedAt ? "opacity-30" : ""}`}
          >
            {whistory.moneyAmount}
          </div>
        );
      },
    },
    {
      accessorKey: "date",
      header: () => <div className="w-2/12 text-center">{dictionary.date}</div>,
      cell: ({ row }) => {
        const whistory = row.original;
        return (
          <div
            className={`w-2/12 text-center ${whistory.deletedAt ? "opacity-30" : ""}`}
          >
            {formatDateOnly(whistory.date)}
          </div>
        );
      },
    },
    {
      accessorKey: "changes",
      header: () => (
        <div className="w-3/12 text-center">{dictionary.changes}</div>
      ),
      cell: ({ row }) => {
        const whistory = row.original;
        const absoluteChanges = whistory.changesAbs
          ? `${(whistory.changesAbs || 0).toFixed(2)}`
          : "";
        const relativeChanges = whistory.changes
          ? `${((whistory.changes || 0) * 100).toFixed(2)}%`
          : "";

        return (
          <div
            className={`w-3/12 text-center ${whistory.deletedAt ? "opacity-30" : ""}`}
          >
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Changes
                    text={absoluteChanges}
                    isPositive={(whistory.changes || 0) >= 0}
                  />
                </TooltipTrigger>
                {relativeChanges && (
                  <TooltipContent>
                    <p>{relativeChanges}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
    {
      accessorKey: "comment",
      header: () => (
        <div className="w-2/12 text-center">{dictionary.comment}</div>
      ),
      cell: ({ row }) => {
        const whistory = row.original;
        return (
          <div
            className={`flex w-2/12 justify-center text-center ${whistory.deletedAt ? "opacity-30" : ""}`}
          >
            {whistory.comment ? <MessageSquare className="h-4 w-4" /> : "-"}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => (
        <div className="w-2/12 text-center">{dictionary.actions}</div>
      ),
      cell: ({ row }) => (
        <ActionsCell whistory={row.original} dictionary={dictionary} />
      ),
    },
  ];
};
