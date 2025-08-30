"use client";

import { useContext } from "react";

import CreateButton from "@/shared/components/buttons/CreateButton";
import { OverlayContext } from "@/shared/components/overlay/OverlayProvider";

import CreateExpenseModal from "./CreateExpenseModal";

interface Props {
  currency: string;
  text?: string;
  types?: string[] | null;
  defaultDate?: Date;
}

export default function CreateExpenseButton({
  types,
  currency,
  text = "",
  defaultDate,
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

  return <CreateButton text={text} onClick={onClick} />;
}
