"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { duplicate } from "@/app/[locale]/wallets/[id]/actions";
import DuplicateIcon from "@/assets/duplicate.svg";

interface Props {
  walletId: string;
  whistoryId: string;
}

const DuplicateButton = ({ whistoryId, walletId }: Props) => {
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    let timer = undefined;
    if (disabled) {
      timer = setTimeout(() => {
        setDisabled(false);
      }, 1500);
    }

    return () => clearTimeout(timer);
  }, [disabled]);

  const onClick = () => {
    setDisabled(true);
    duplicate(whistoryId, walletId);
  };

  return (
    <button
      className="h-4 w-4 cursor-pointer opacity-70 hover:opacity-100 disabled:cursor-default disabled:opacity-30"
      onClick={onClick}
      disabled={disabled}
    >
      <Image src={DuplicateIcon} width={16} height={16} alt="duplicate" />
    </button>
  );
};

export default DuplicateButton;
