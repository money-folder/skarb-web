"use client";

import Image from "next/image";

import DuplicateIcon from "@/assets/duplicate.svg";
import { duplicate } from "@/app/[locale]/wallets/[id]/actions";

interface Props {
  walletId: string;
  whistoryId: string;
}

const DuplicateButton = ({ whistoryId, walletId }: Props) => {
  return (
    <button
      className="w-4 h-4 cursor-pointer opacity-70 hover:opacity-100"
      onClick={() => duplicate(whistoryId, walletId)}
    >
      <Image src={DuplicateIcon} width={16} height={16} alt="duplicate" />
    </button>
  );
};

export default DuplicateButton;
