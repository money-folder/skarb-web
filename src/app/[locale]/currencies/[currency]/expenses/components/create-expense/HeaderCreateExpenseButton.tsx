"use client";

import Image from "next/image";
import { useContext } from "react";

import { OverlayContext } from "@/shared/components/overlay/OverlayProvider";

import CreateExpenseModal from "./CreateExpenseModal";

import PlusIcon from "@/assets/plus.svg";

interface Props {
  currency: string;
  text?: string;
  types?: string[] | null;
  defaultDate?: Date;
  className?: string;
}

export default function HeaderCreateExpenseButton({
  types,
  currency,
  text = "",
  defaultDate,
  className = "",
}: Props) {
  const { addOverlay } = useContext(OverlayContext);

  const onClick = () => {
    addOverlay(({ removeSelf }) => (
      <CreateExpenseModal
        close={removeSelf}
        currency={currency}
        types={types}
        defaultDate={defaultDate}
      />
    ));
  };

  return (
    <button
      className={`inline-flex cursor-pointer items-center space-x-2 rounded-md font-medium transition-colors hover:bg-gray-300/60 ${className}`}
      onClick={onClick}
    >
      <Image src={PlusIcon} width={16} height={16} alt="plus" />
      {text ? <span>{text}</span> : null}
    </button>
  );
}
