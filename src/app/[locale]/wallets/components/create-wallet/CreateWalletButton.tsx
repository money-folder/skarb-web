"use client";

import { useState } from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CreateButton from "@/shared/components/buttons/CreateButton";

import CreateWalletModal from "./CreateWalletModal";

interface CreateWalletButtonProps {
  text?: string;
}

export default function CreateWalletButton({
  text = "",
}: CreateWalletButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <CreateButton text={text} onClick={() => setOpen(true)} />
      </DialogTrigger>
      <DialogContent>
        <CreateWalletModal close={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
