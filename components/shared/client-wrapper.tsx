"use client";

import { ReactNode } from "react";
import { StoreProvider } from "@/context/store-context";

export function ClientWrapper({ children }: { children: ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>;
}