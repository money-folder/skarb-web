"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Dictionary } from "@/dictionaries/locale";

import CreateEarningModal from "./CreateEarningModal";

interface Props {
  currency: string;
  text: string;
  types?: string[] | null;
  defaultDate?: Date;
  dictionary: {
    title: string;
    form: Dictionary["modals"]["earningForm"];
  };
}

export default function CreateEarningButton({
  types,
  currency,
  text,
  defaultDate,
  dictionary,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} asChild>
        <div>
          <Plus className="h-4 w-4" />
          <span>{text}</span>
        </div>
      </Button>
      <DialogContent>
        <CreateEarningModal
          close={() => setOpen(false)}
          currency={currency}
          types={types}
          defaultDate={defaultDate}
          dictionary={dictionary}
        />
      </DialogContent>
    </Dialog>
  );
}
