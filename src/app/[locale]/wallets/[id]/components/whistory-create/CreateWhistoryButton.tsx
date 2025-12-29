"use client";

import { useState } from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CreateItemButton from "@/shared/components/buttons/CreateButton";

import AddWhistoryModal from "./CreateWhistoryModal";

interface CreateWhistoryButtonProps {
  walletId: string;
  walletName: string;
  text?: string;
}

const CreateWhistoryButton = ({
  walletId,
  walletName,
  text = "",
}: CreateWhistoryButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <CreateItemButton text={text} onClick={() => setOpen(true)} />
      </DialogTrigger>
      <DialogContent>
        <AddWhistoryModal
          walletId={walletId}
          walletName={walletName}
          close={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateWhistoryButton;
