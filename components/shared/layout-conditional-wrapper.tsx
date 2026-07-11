"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { LuxuryHeader } from "./luxury-header";
import { LuxuryFooter } from "./luxury-footer";
import { MegaMenuData } from "@/types/index";
import { FooterColumnData } from "@/lib/data/footer";

interface LayoutConditionalWrapperProps {
  children: ReactNode;
  megaMenuData: MegaMenuData;
  footerColumns: FooterColumnData[];
}

export function LayoutConditionalWrapper({
  children,
  megaMenuData,
  footerColumns,
}: LayoutConditionalWrapperProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <LuxuryHeader megaMenuData={megaMenuData} />
      <main className="min-h-screen bg-white">{children}</main>
      <LuxuryFooter columns={footerColumns} />
    </>
  );
}
