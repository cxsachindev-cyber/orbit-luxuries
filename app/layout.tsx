// app/layout.tsx
import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import "@/styles/globals.css";
import { StoreProvider } from "@/context/store-context";
import { LayoutConditionalWrapper } from "@/components/shared/layout-conditional-wrapper";
import { getMegaMenuData } from "@/lib/data/megamenu";
import { getFooterColumns } from "@/lib/data/footer";

const fontSerif = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["500", "600", "700"],
});

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Orbit Luxuries | Premium Luxury Fashion",
  description:
    "Shop the finest luxury fashion, watches, jewellery, beauty and home brands at Orbit Luxuries.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [megaMenuData, footerColumns] = await Promise.all([
    getMegaMenuData(),
    getFooterColumns(),
  ]);

  return (
    <html lang="en" className={`${fontSerif.variable} ${fontSans.variable}`}>
      <body className="font-sans bg-luxe-black text-white">
        <StoreProvider>
          <LayoutConditionalWrapper
            megaMenuData={megaMenuData}
            footerColumns={footerColumns}
          >
            {children}
          </LayoutConditionalWrapper>
        </StoreProvider>
      </body>
    </html>
  );
}