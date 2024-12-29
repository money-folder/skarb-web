"use client";

import { useContext } from "react";

import CreateItemButton from "@/shared/components/buttons/CreateButton";
import { OverlayContext } from "@/shared/components/overlay/OverlayProvider";

import AddWhistoryModal from "./CreateWhistoryModal";

interface CreateWhistoryButtonProps {
  walletId: string;
  walletName: string;
  text?: string;
}

const CreateWhistoryButton = ({
  walletId,
  walletName,
  text = "",
}: CreateWhistoryButtonProps) => {
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
