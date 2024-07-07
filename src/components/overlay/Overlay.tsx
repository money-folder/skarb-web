import React from "react";

const Overlay: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => (
  <div className="absolute top-0 left-0 h-full w-full flex justify-center items-center bg-black bg-opacity-50">
    {children}
  </div>
);

export default Overlay;
