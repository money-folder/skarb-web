import React from "react";

const Overlay: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => (
  <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
    {children}
  </div>
);

export default Overlay;
