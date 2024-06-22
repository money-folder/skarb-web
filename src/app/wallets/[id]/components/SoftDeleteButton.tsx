"use client";

import Image from "next/image";

import { archive } from "@/actions/wallet-history";

import CrossIcon from "@/assets/cross.svg";

interface SoftDeleteButtonProps {
  id: string;
}

const SoftDeleteButton = ({ id }: SoftDeleteButtonProps) => {
  return (
    <button
      className="w-4 h-4 cursor-pointer opacity-70 hover:opacity-100"
      onClick={() => archive(id)}
    >
      <Image src={CrossIcon} alt="cross" />
    </button>
  );
};

export default SoftDeleteButton;
