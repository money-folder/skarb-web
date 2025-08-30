"use client";

import { MoreHorizontal } from "lucide-react";
import { MouseEventHandler, useContext } from "react";

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
import { OverlayContext } from "@/shared/components/overlay/OverlayProvider";

import AddWhistoryModal from "../../[id]/components/whistory-create/CreateWhistoryModal";
import { ClientWalletDto } from "../../types";
import EditWalletModal from "../edit-wallet/EditWalletModal";

interface ActionsCellProps {
  wallet: ClientWalletDto;
  dictionary: Dictionary["walletsPage"]["walletsTable"];
}

const ActionsCell = ({ wallet, dictionary }: ActionsCellProps) => {
  const { addOverlay } = useContext(OverlayContext);

  // Action handlers
  const handleCreateWhistory: MouseEventHandler<HTMLDivElement> = () => {
    addOverlay(({ removeSelf }) => (
      <AddWhistoryModal
        walletId={wallet.id}
        walletName={wallet.name}
        close={removeSelf}
      />
    ));
  };

  const handleDuplicate: MouseEventHandler<HTMLDivElement> = () => {
    duplicate(wallet.latestWhistory!.id, wallet.id);
  };

  const handleEdit: MouseEventHandler<HTMLDivElement> = () => {
    addOverlay(({ removeSelf }) => (
      <EditWalletModal wallet={wallet} close={removeSelf} />
    ));
  };

  const handleRestore: MouseEventHandler<HTMLDivElement> = async () => {
    await unrchive(wallet.id);
    window.location.reload();
  };

  const handleDestroy: MouseEventHandler<HTMLDivElement> = async () => {
    if (confirm(dictionary.actionsMenu.confirmPermanentDeleteMessage)) {
      await destroy(wallet.id);
      window.location.reload();
    }
  };

  const handleSoftDelete: MouseEventHandler<HTMLDivElement> = async () => {
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
        <DropdownMenuContent
          align="end"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
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

export default ActionsCell;
