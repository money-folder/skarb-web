"use client";

import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dictionary } from "@/dictionaries/locale";

import { archive, destroy, duplicate, unarchive } from "../../actions";
import { ClientWhistoryDto } from "../../types";
import EditWhistoryModal from "../whistory-edit/EditWhistoryModal";
import ViewWhistoryDialog from "./ViewWhistoryDialog";

interface ActionsCellProps {
  whistory: ClientWhistoryDto;
  dictionary: Dictionary["whistoryPage"]["whistoryTable"];
}

export const ActionsCell = ({ whistory, dictionary }: ActionsCellProps) => {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Action handlers
  const handleView = () => {
    setIsViewDialogOpen(true);
  };

  const handleDuplicate = () => {
    duplicate(whistory.id, whistory.walletId);
  };

  const handleEdit = () => {
    setIsEditDialogOpen(true);
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

          <DropdownMenuItem onClick={handleView}>
            {dictionary.actionsMenu.view}
          </DropdownMenuItem>

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

      <ViewWhistoryDialog
        whistory={whistory}
        isOpen={isViewDialogOpen}
        onClose={setIsViewDialogOpen}
        dictionary={dictionary}
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <EditWhistoryModal
            whistory={whistory}
            close={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
