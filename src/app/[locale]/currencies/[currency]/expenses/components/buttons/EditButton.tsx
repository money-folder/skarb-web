"use client";

import Image from "next/image";
import { useContext } from "react";

import EditIcon from "@/assets/edit.svg";
import { OverlayContext } from "@/shared/components/overlay/OverlayProvider";

import EditExpenseModal from "../../components/edit-expense/EditExpenseModal";
import { ClientExpenseDto } from "../../types";

interface EditButtonProps {
  expense: ClientExpenseDto;
  currency: string;
  types?: string[] | null;
}

const EditButton = ({ expense, currency, types }: EditButtonProps) => {
  const { addOverlay } = useContext(OverlayContext);

  const onClick = () => {
    addOverlay(({ removeSelf }) => (
      <EditExpenseModal
        close={removeSelf}
        expense={expense}
        currency={currency}
        types={types}
      />
    ));
  };

  return (
    <button
      className="mr-3 h-4 w-4 cursor-pointer opacity-70 hover:opacity-100"
      onClick={onClick}
    >
      <Image src={EditIcon} alt="edit" />
    </button>
  );
};

export default EditButton;
