"use client";

import React from "react";

import { useMounted } from "@/shared/hooks/useMounted";

interface WithMoutedProps {
  children: React.ReactNode;
}

export const WithMounted = ({ children }: WithMoutedProps) => {
  const mounted = useMounted();

  if (!mounted) {
    return null;
  }

  return children;
};
