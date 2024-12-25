"use client";

import Image from "next/image";
import { useContext } from "react";

import CreateWhistoryModal from "@/widgets/create-whistory/CreateWhistoryModal";
import { OverlayContext } from "@/shared/components/overlay/OverlayProvider";

import PlusIcon from "@/assets/plus.svg";

interface Props {
  walletId: string;
  walletName: string;
}

export default function AddWhistoryButton({ walletId, walletName }: Props) {
  const { addOverlay } = useContext(OverlayContext);

  const onClick = () => {
    addOverlay(({ removeSelf }) => (
      <CreateWhistoryModal
        walletId={walletId}
        walletName={walletName}
        close={removeSelf}
      />
    ));
  };

  return (
    <button
      className="w-4 h-4 cursor-pointer opacity-70 hover:opacity-100"
      onClick={onClick}
    >
      <Image src={PlusIcon} alt="create" />
    </button>
  );
}
