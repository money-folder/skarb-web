"use client";

import Image from "next/image";
import { useState } from "react";

import EditIcon from "@/assets/edit.svg";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import EditExpenseModal from "../../components/edit-expense/EditExpenseModal";
import { ClientExpenseDto } from "../../types";

interface EditButtonProps {
  expense: ClientExpenseDto;
  currency: string;
  types?: string[] | null;
}

const EditButton = ({ expense, currency, types }: EditButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        size="icon"
        className="mr-3 h-4 w-4 cursor-pointer opacity-70 hover:opacity-100"
        onClick={() => setOpen(true)}
      >
        <Image src={EditIcon} alt="edit" />
      </Button>

      <DialogContent>
        <EditExpenseModal
          close={() => setOpen(false)}
          expense={expense}
          currency={currency}
          types={types}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditButton;
