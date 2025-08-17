"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useContext } from "react";

import { duplicate } from "@/app/[locale]/wallets/[id]/actions";
import { archive, destroy, unrchive } from "@/app/[locale]/wallets/actions";
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
import { Locale } from "@/locale";
import { OverlayContext } from "@/shared/components/overlay/OverlayProvider";
import { formatDateDifference } from "@/shared/utils/time-utils";

import AddWhistoryModal from "../../[id]/components/whistory-create/CreateWhistoryModal";
import { ClientWalletDto } from "../../types";
import Changes from "../Changes";
import EditWalletModal from "../edit-wallet/EditWalletModal";

// This component is needed to access the context in the cell render function
const ActionsCell = ({
  wallet,
  dictionary,
}: {
  wallet: ClientWalletDto;
  dictionary: Dictionary["walletsPage"]["walletsTable"];
}) => {
  const { addOverlay } = useContext(OverlayContext);

  // Action handlers
  const handleCreateWhistory = () => {
    addOverlay(({ removeSelf }) => (
      <AddWhistoryModal
        walletId={wallet.id}
        walletName={wallet.name}
        close={removeSelf}
      />
    ));
  };

  const handleDuplicate = () => {
    duplicate(wallet.latestWhistory!.id, wallet.id);
  };

  const handleEdit = () => {
    addOverlay(({ removeSelf }) => (
      <EditWalletModal wallet={wallet} close={removeSelf} />
    ));
  };

  const handleRestore = async () => {
    await unrchive(wallet.id);
    window.location.reload();
  };

  const handleDestroy = async () => {
    if (confirm(dictionary.actionsMenu.confirmPermanentDeleteMessage)) {
      await destroy(wallet.id);
      window.location.reload();
    }
  };

  const handleSoftDelete = async () => {
    if (confirm(dictionary.actionsMenu.confirmDeleteMessage)) {
      await archive(wallet.id);
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

          <DropdownMenuItem onClick={handleCreateWhistory}>
            {dictionary.actionsMenu.addBalance}
          </DropdownMenuItem>

          {wallet.latestWhistory && !wallet.deletedAt && (
            <DropdownMenuItem onClick={handleDuplicate}>
              {dictionary.actionsMenu.duplicateLastBalance}
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={handleEdit}>
            {dictionary.actionsMenu.editWallet}
          </DropdownMenuItem>

          {wallet.deletedAt ? (
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
