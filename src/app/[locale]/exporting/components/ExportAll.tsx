"use client";

import { useContext } from "react";

import { DictionaryContext } from "@/shared/components/Dictionary";
import { OverlayContext } from "@/shared/components/overlay/OverlayProvider";

import { ExportAllModal } from "./ExportAllModal";

export const ExportAll = () => {
  const { d } = useContext(DictionaryContext);
  const { addOverlay } = useContext(OverlayContext);

  const onClick = () => {
    addOverlay(({ removeSelf }) => <ExportAllModal close={removeSelf} />);
  };

  return (
    <>
      <button className="text-white hover:underline" onClick={onClick}>
        {d.footer.exportAll}
      </button>
    </>
  );
};
