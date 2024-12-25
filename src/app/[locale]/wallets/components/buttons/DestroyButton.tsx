"use client";

import Image from "next/image";

import { destroy } from "@/app/[locale]/wallets/actions";

import TrashIcon from "@/assets/trash.svg";

interface DestroyButtonProps {
  id: string;
}

const DestroyButton = ({ id }: DestroyButtonProps) => {
  return (
    <button
      className="h-4 w-4 cursor-pointer opacity-70 hover:opacity-100"
      onClick={() => destroy(id)}
    >
      <Image src={TrashIcon} width={16} height={16} alt="trash" />
    </button>
  );
};

export default DestroyButton;
