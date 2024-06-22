"use client";

import Image from "next/image";

import { unarchive } from "../actions";

import RestoreIcon from "@/assets/restore.svg";

interface RestoreButtonProps {
  id: string;
}

const RestoreButton = ({ id }: RestoreButtonProps) => {
  return (
    <button
      className="w-4 h-4 cursor-pointer opacity-70 hover:opacity-100"
      onClick={() => unarchive(id)}
    >
      <Image src={RestoreIcon} alt="restore" />
    </button>
  );
};

export default RestoreButton;
