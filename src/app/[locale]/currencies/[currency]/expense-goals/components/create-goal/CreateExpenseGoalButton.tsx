"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import CreateExpenseGoalModal from "./CreateExpenseGoalModal";

interface Props {
  currency: string;
  text: string;
  types?: string[] | null;
  defaultDate?: Date;
}

export default function CreateExpenseGoalButton({
  types,
  currency,
  text,
  defaultDate,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        <span>{text}</span>
      </Button>
      <DialogContent>
        <CreateExpenseGoalModal
          close={() => setOpen(false)}
          currency={currency}
          types={types}
          defaultDate={defaultDate}
        />
      </DialogContent>
    </Dialog>
  );
}
