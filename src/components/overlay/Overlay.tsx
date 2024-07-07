import React from "react";

import { EmptyObject } from "@/types/helpers";

const Overlay: React.FC<React.PropsWithChildren<EmptyObject>> = ({
  children,
}) => (
  <div className="absolute top-0 left-0 h-full w-full flex justify-center items-center bg-black bg-opacity-50">
    {children}
  </div>
);

export default Overlay;
