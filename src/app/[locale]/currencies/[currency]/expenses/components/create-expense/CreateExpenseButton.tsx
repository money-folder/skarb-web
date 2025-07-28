"use client";

import { useContext } from "react";

import CreateButton from "@/shared/components/buttons/CreateButton";
import { OverlayContext } from "@/shared/components/overlay/OverlayProvider";

import CreateExpenseModal from "./CreateExpenseModal";

interface Props {
  currency: string;
  text?: string;
}

export default function CreateExpenseButton({ currency, text = "" }: Props) {
  const { addOverlay } = useContext(OverlayContext);

  const onClick = () => {
    addOverlay(({ removeSelf }) => (
      <CreateExpenseModal close={removeSelf} currency={currency} />
    ));
  };

  return <CreateButton text={text} onClick={onClick} />;
}
