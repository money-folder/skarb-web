"use client";

import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

import { WhistoryComposed } from "@/app/[locale]/wallets/[id]/types";
import Changes from "@/app/[locale]/wallets/components/Changes";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dictionary } from "@/dictionaries/locale";

interface ActionsCellProps {
  entry: WhistoryComposed;
  dictionary: Dictionary["currencyPage"]["currencyTable"];
}

export const ActionsCell = ({ entry, dictionary }: ActionsCellProps) => {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleView = () => {
    setIsViewDialogOpen(true);
  };

  return (
    <>
      <div className="flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">{dictionary.actions}</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {dictionary.actionsMenu.label}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleView}>
              {dictionary.actionsMenu.view}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ViewEntryDialog
        entry={entry}
        isOpen={isViewDialogOpen}
        onClose={setIsViewDialogOpen}
        dictionary={dictionary}
      />
    </>
  );
};

interface ViewEntryDialogProps {
  entry: WhistoryComposed;
  isOpen: boolean;
  onClose: (open: boolean) => void;
  dictionary: Dictionary["currencyPage"]["currencyTable"];
}

const ViewEntryDialog = ({
  entry,
  isOpen,
  onClose,
  dictionary,
}: ViewEntryDialogProps) => {
  const changesText = entry.changes
    ? `${(entry.changesAbs || 0).toFixed(2)} (${((entry.changes || 0) * 100).toFixed(2)}%)`
    : "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{dictionary.viewDialog.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                {dictionary.moneyAmount}
              </p>
              <p className="text-sm font-semibold">{entry.moneyAmount}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                {dictionary.date}
              </p>
              <p className="text-sm">{entry.date.toLocaleString()}</p>
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs font-medium text-muted-foreground">
              {dictionary.changes}
            </p>
            <Changes text={changesText} isPositive={(entry.changes || 0) > 0} />
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              {dictionary.wallets}
            </p>
            <div className="space-y-2">
              {entry.whistories.map((wh) => (
                <div
                  key={wh.id}
                  className="rounded-md border border-border bg-muted/30 p-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{wh.wallet.name}</p>
                      {wh.comment && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {wh.comment}
                        </p>
                      )}
                    </div>
                    <p className="text-sm font-semibold">{wh.moneyAmount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
