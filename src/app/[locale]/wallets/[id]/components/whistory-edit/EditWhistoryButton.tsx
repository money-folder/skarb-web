"use client";

import Image from "next/image";
import { useContext } from "react";

import { OverlayContext } from "@/shared/components/overlay/OverlayProvider";

import { ClientWhistoryDto } from "../../types";
import EditWhistoryModal from "./EditWhistoryModal";

import EditIcon from "@/assets/edit.svg";

interface Props {
  whistory: ClientWhistoryDto;
}

const EditWhistoryButton = ({ whistory }: Props) => {
  const { addOverlay } = useContext(OverlayContext);

  const onClick = () => {
    addOverlay(({ removeSelf }) => (
      <EditWhistoryModal whistory={whistory} close={removeSelf} />
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

export default EditWhistoryButton;
