import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dictionary } from "@/dictionaries/locale";

import Changes from "../../../../wallets/components/Changes";
import { ClientWhistoryDto } from "../../types";

interface ViewWhistoryDialogProps {
  whistory: ClientWhistoryDto;
  isOpen: boolean;
  onClose: (open: boolean) => void;
  dictionary: Dictionary["whistoryPage"]["whistoryTable"];
}

const ViewWhistoryDialog = ({
  whistory,
  isOpen,
  onClose,
  dictionary,
}: ViewWhistoryDialogProps) => {
  const absoluteChanges = whistory.changesAbs
    ? `${(whistory.changesAbs || 0).toFixed(2)}`
    : "";

  const relativeChanges = whistory.changes
    ? `(${((whistory.changes || 0) * 100).toFixed(2)}%)`
    : "";

  const changesText = [absoluteChanges, relativeChanges]
    .filter(Boolean)
    .join(" ");

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
                {dictionary.balance}
              </p>
              <p className="text-sm font-semibold">{whistory.moneyAmount}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                {dictionary.date}
              </p>
              <p className="text-sm">{whistory.date.toLocaleString()}</p>
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs font-medium text-muted-foreground">
              {dictionary.changes}
            </p>
            <Changes
              text={changesText}
              isPositive={(whistory.changes || 0) >= 0}
            />
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">
              {dictionary.comment}
            </p>
            <p className="mt-1 text-sm">{whistory.comment || "-"}</p>
          </div>

          {whistory.deletedAt && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                {dictionary.viewDialog.deletedAt}
              </p>
              <p className="text-sm text-red-600">
                {whistory.deletedAt.toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewWhistoryDialog;
