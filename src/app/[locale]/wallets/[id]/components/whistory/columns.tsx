"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useContext } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dictionary } from "@/dictionaries/locale";
import { OverlayContext } from "@/shared/components/overlay/OverlayProvider";

import Changes from "../../../../wallets/components/Changes";
import { archive, destroy, duplicate, unarchive } from "../../actions";
import { ClientWhistoryDto } from "../../types";
import EditWhistoryModal from "../whistory-edit/EditWhistoryModal";

// This component is needed to access the context in the cell render function
const ActionsCell = ({
  whistory,
  dictionary,
}: {
  whistory: ClientWhistoryDto;
  dictionary: Dictionary["whistoryPage"]["whistoryTable"];
}) => {
  const { addOverlay } = useContext(OverlayContext);

  // Action handlers
  const handleDuplicate = () => {
    duplicate(whistory.id, whistory.walletId);
  };

  const handleEdit = () => {
    addOverlay(({ removeSelf }) => (
      <EditWhistoryModal whistory={whistory} close={removeSelf} />
    ));
  };

  const handleRestore = async () => {
    await unarchive(whistory.id);
    window.location.reload();
  };

  const handleDestroy = async () => {
    if (confirm(dictionary.actionsMenu.confirmPermanentDeleteMessage)) {
      await destroy(whistory.id);
      window.location.reload();
    }
  };

  const handleSoftDelete = async () => {
    if (confirm(dictionary.actionsMenu.confirmDeleteMessage)) {
      await archive(whistory.id);
      window.location.reload();
    }
  };

  return (
    <div className="flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">{dictionary.actions}</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{dictionary.actionsMenu.label}</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleDuplicate}>
            {dictionary.actionsMenu.duplicate}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleEdit}>
            {dictionary.actionsMenu.edit}
          </DropdownMenuItem>

          {whistory.deletedAt ? (
            <>
              <DropdownMenuItem onClick={handleRestore}>
                {dictionary.actionsMenu.restore}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleDestroy}
                className="text-red-600"
              >
                {dictionary.actionsMenu.deletePermanently}
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem
              onClick={handleSoftDelete}
              className="text-red-600"
            >
              {dictionary.actionsMenu.delete}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const createColumns = (
  dictionary: Dictionary["whistoryPage"]["whistoryTable"],
): ColumnDef<ClientWhistoryDto>[] => {
  return [
    {
      accessorKey: "moneyAmount",
      header: () => <div className="text-right">{dictionary.balance}</div>,
      cell: ({ row }) => {
        const whistory = row.original;
        return (
          <div
            className={`text-right ${whistory.deletedAt ? "opacity-30" : ""}`}
          >
            {whistory.moneyAmount}
          </div>
        );
      },
    },
    {
      accessorKey: "date",
      header: () => <div className="text-center">{dictionary.date}</div>,
      cell: ({ row }) => {
        const whistory = row.original;
        return (
          <div
            className={`text-center ${whistory.deletedAt ? "opacity-30" : ""}`}
          >
            {whistory.date.toLocaleString().split(", ")[0]}
          </div>
        );
      },
    },
    {
      accessorKey: "changes",
      header: () => <div className="text-center">{dictionary.changes}</div>,
      cell: ({ row }) => {
        const whistory = row.original;
        const changesText = whistory.changes
          ? `${(whistory.changesAbs || 0).toFixed(2)} (${((whistory.changes || 0) * 100).toFixed(2)}%)`
          : "";

        return (
          <div
            className={`text-center ${whistory.deletedAt ? "opacity-30" : ""}`}
          >
            <Changes
              text={changesText}
              isPositive={(whistory.changes || 0) >= 0}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "comment",
      header: () => <div className="text-left">{dictionary.comment}</div>,
      cell: ({ row }) => {
        const whistory = row.original;
        return (
          <div
            className={`text-left ${whistory.deletedAt ? "opacity-30" : ""}`}
          >
            {whistory.comment || "-"}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">{dictionary.actions}</div>,
      cell: ({ row }) => (
        <ActionsCell whistory={row.original} dictionary={dictionary} />
      ),
    },
  ];
};
