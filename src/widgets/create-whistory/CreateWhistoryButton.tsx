"use client";

import React, { useContext } from "react";

import CreateItemButton from "@/components/buttons/CreateButton";
import { OverlayContext } from "@/components/overlay/OverlayProvider";

import AddWhistoryModal from "./CreateWhistoryModal";

interface Props {
  walletId: string;
  walletName: string;
  text?: string;
}

const CreateWhistoryButton = ({ walletId, walletName, text }: Props) => {
  const { addOverlay } = useContext(OverlayContext);

  const onClick = () => {
    addOverlay(({ removeSelf }) => (
      <AddWhistoryModal
        walletId={walletId}
        walletName={walletName}
        close={removeSelf}
      />
    ));
  };

  return <CreateItemButton text={text} onClick={onClick} />;
};

export default CreateWhistoryButton;
