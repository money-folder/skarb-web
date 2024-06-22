"use client";

import Image from "next/image";

import { unrchive } from "@/actions/wallets";

import RestoreIcon from "@/assets/restore.svg";

interface RestoreButtonProps {
  id: string;
}

const RestoreButton = ({ id }: RestoreButtonProps) => {
  return (
    <button
      className="w-4 h-4 cursor-pointer opacity-70 hover:opacity-100"
      onClick={() => unrchive(id)}
    >
      <Image src={RestoreIcon} width={16} height={16} alt="restore" />
    </button>
  );
};

export default RestoreButton;
