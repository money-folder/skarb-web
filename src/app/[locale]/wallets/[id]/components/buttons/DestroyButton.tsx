"use client";

import Image from "next/image";

import { destroy } from "@/app/[locale]/wallets/[id]/actions";

import TrashIcon from "@/assets/trash.svg";

interface DestroyButtonProps {
  id: string;
}

const DestroyButton = ({ id }: DestroyButtonProps) => {
  return (
    <button
      className="w-4 h-4 cursor-pointer opacity-70 hover:opacity-100"
      onClick={() => destroy(id)}
    >
      <Image src={TrashIcon} alt="trash" />
    </button>
  );
};

export default DestroyButton;
