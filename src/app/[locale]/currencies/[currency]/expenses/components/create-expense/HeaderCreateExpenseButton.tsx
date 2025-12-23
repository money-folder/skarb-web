"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";

import CreateExpenseModal from "./CreateExpenseModal";

interface Props {
  currency: string;
  text?: string;
  types?: string[] | null;
  defaultDate?: Date;
  className?: string;
}

export default function HeaderCreateExpenseButton({
  types,
  currency,
  text = "",
  defaultDate,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        className={`inline-flex cursor-pointer items-center space-x-2 rounded-md font-medium transition-colors hover:bg-gray-300/60 ${className}`}
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4" />
        {text ? <span>{text}</span> : null}
      </button>
      <DialogContent>
        <CreateExpenseModal
          close={() => setOpen(false)}
          currency={currency}
          types={types}
          defaultDate={defaultDate}
        />
      </DialogContent>
    </Dialog>
  );
}
