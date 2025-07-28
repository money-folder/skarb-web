"use client";

import Image from "next/image";

import TrashIcon from "@/assets/trash.svg";
import { destroyExpense } from "../../actions";

interface DestroyButtonProps {
  id: string;
  currency: string;
}

const DestroyButton = ({ id, currency }: DestroyButtonProps) => {
  return (
    <button
      className="h-4 w-4 cursor-pointer opacity-70 hover:opacity-100"
      onClick={() => destroyExpense(id, currency)}
    >
      <Image src={TrashIcon} alt="trash" />
    </button>
  );
};

export default DestroyButton;
