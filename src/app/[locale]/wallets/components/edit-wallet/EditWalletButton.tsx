"use client";

import Image from "next/image";
import { useContext } from "react";

import { OverlayContext } from "@/shared/components/overlay/OverlayProvider";

import { ClientWalletDto } from "../../types";
import EditWalletModal from "./EditWalletModal";

import EditIcon from "@/assets/edit.svg";

interface Props {
  wallet: ClientWalletDto;
}

export const EditButton = ({ wallet }: Props) => {
  const { addOverlay } = useContext(OverlayContext);

  const onClick = () => {
    addOverlay(({ removeSelf }) => (
      <EditWalletModal wallet={wallet} close={removeSelf} />
    ));
  };

  return (
    <button
      className="h-4 w-4 cursor-pointer opacity-70 hover:opacity-100"
      onClick={onClick}
    >
      <Image src={EditIcon} alt="edit" />
    </button>
  );
};
