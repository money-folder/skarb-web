"use client";

import Image from "next/image";

import TrashIcon from "@/assets/trash.svg";
import { destroyExpenseGoal } from "../../../actions";

interface DestroyButtonProps {
  id: string;
  currency: string;
}

const DestroyButton = ({ id, currency }: DestroyButtonProps) => {
  return (
    <button
      type="button"
      aria-label="Delete expense goal"
      className="h-4 w-4 cursor-pointer opacity-70 hover:opacity-100"
      onClick={() => destroyExpenseGoal(id, currency)}
    >
      <Image src={TrashIcon} alt="" />
    </button>
  );
};

export default DestroyButton;
