"use client";

import { useContext } from "react";

import CreateButton from "@/components/buttons/CreateButton";
import { OverlayContext } from "@/components/overlay/OverlayProvider";

import CreateWalletModal from "./CreateWalletModal";

export default function CreateWalletButton() {
  const { addOverlay } = useContext(OverlayContext);

  const onClick = () => {
    addOverlay(({ removeSelf }) => <CreateWalletModal close={removeSelf} />);
  };

  return <CreateButton text="Create" onClick={onClick} />;
}
