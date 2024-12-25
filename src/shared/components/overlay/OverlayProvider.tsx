"use client";

import { createContext, useEffect, useState } from "react";

import { generatePseudoUUID } from "@/shared/utils/utils";

interface GetOverlayNodeParams {
  removeSelf: () => void;
}

interface OverlayContextParams {
  addOverlay: (
    getOverlayNode: (params: GetOverlayNodeParams) => React.ReactNode
  ) => void;

  removeOverlay: (overlayId: string) => void;
  clearOverlays: () => void;
}

export const OverlayContext = createContext<OverlayContextParams>({
  addOverlay: () => {},
  removeOverlay: () => {},
  clearOverlays: () => {},
});

interface OverlayProviderProps {
  children: React.ReactNode;
}

interface OverlayItem {
  id: string;
  component: React.ReactNode;
}

export default function OverlayProvider({ children }: OverlayProviderProps) {
  const [overlays, setOverlays] = useState<OverlayItem[]>([]);

  // remove the top overlay on Esc click
  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOverlays((prevOverlays) =>
          prevOverlays.filter((_, index, array) => array.length - 1 !== index)
        );
      }
    };

    window.addEventListener("keydown", onKeydown);

    return () => window.removeEventListener("keydown", onKeydown);
  }, []);

  const removeOverlay = (overlayId: string) => {
    setOverlays((prevOverlays) =>
      prevOverlays.filter((o) => o.id !== overlayId)
    );
  };

  const addOverlay = (
    getOverlayNode: (params: GetOverlayNodeParams) => React.ReactNode
  ) => {
    const id = generatePseudoUUID();

    setOverlays((prevOverlays) => [
      ...prevOverlays,
      {
        id,
        component: getOverlayNode({ removeSelf: () => removeOverlay(id) }),
      },
    ]);

    return () => removeOverlay(id);
  };

  const clearOverlays = () => {
    setOverlays([]);
  };

  return (
    <OverlayContext.Provider
      value={{ addOverlay, removeOverlay, clearOverlays }}
    >
      {children}
      {overlays.length
        ? overlays.map((overlay) => (
            <div key={overlay.id}>{overlay.component}</div>
          ))
        : null}
    </OverlayContext.Provider>
  );
}
