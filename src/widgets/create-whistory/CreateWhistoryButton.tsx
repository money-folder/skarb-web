import React, { useContext } from "react";

import CreateItemButton from "@/components/buttons/CreateButton";
import { OverlayContext } from "@/components/overlay/OverlayProvider";

import AddWhistoryModal from "./CreateWhistoryModal";

interface Props {
  walletId: string;
  text?: string;
}

const CreateWhistoryButton = ({ walletId, text }: Props) => {
  const { addOverlay } = useContext(OverlayContext);

  const onClick = () => {
    addOverlay(({ removeSelf }) => (
      <AddWhistoryModal walletId={walletId} close={removeSelf} />
    ));
  };

  return <CreateItemButton text={text} onClick={onClick} />;
};

export default CreateWhistoryButton;
