// components/shared/mega-menu-content.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { MegaMenuData } from "@/types/index";
import { BrandsMegaMenu } from "./brands-mega-menu";

interface MegaMenuContentProps {
  navLabel: string;
  data: MegaMenuData;
  onClose: () => void;
}

export function MegaMenuContent({ navLabel, data, onClose }: MegaMenuContentProps) {
  // If it's the Brands menu, render the special Brands component
  if (navLabel === "Brands") {
    return <BrandsMegaMenu data={data} onClose={onClose} />;
  }

  const menu = data[navLabel];
  if (!menu) return null;

  return (
    <div
      // ✅ Added: max-h-[75vh], overflow-y-auto, and custom gold scrollbar styling
      className="absolute left-0 top-full w-full border-t border-white/10 bg-[#121212] text-white shadow-2xl animate-fade-in z-40 max-h-[75vh] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#c9a84c]/50 hover:[&::-webkit-scrollbar-thumb]:bg-[#c9a84c]"
      onMouseLeave={onClose}
    >
      {/* The grid is divided into 4 columns total.
        Columns 1-3 hold the links, Column 4 holds the image.
      */}
      <div className="container mx-auto grid grid-cols-4 px-10 py-8">
        
        {/* Link Columns Wrapper */}
        <div className="col-span-3 grid grid-cols-3 gap-12 pr-12">
          {menu.columns.map((col) => (
            <div key={col.heading}>
              <h4 className="mb-4 pb-2 border-b border-white/20 text-[13px] font-bold text-white tracking-wide">
                {col.heading}
              </h4>
              <ul className="space-y-3 mt-4">
                {col.links
                  // ✅ Added: Smart filter to automatically hide Indiluxe and TimeVallée
                  .filter(link => link.label !== "Indiluxe" && link.label !== "TimeVallée")
                  .map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="text-[13px] text-gray-300 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Featured Image Column */}
        {menu.featuredImage && (
          <div className="col-span-1 border-l border-white/20 pl-12 h-[380px]">
            <h4 className="mb-4 pb-2 text-[13px] font-bold text-white tracking-wide">
              Spotlight On
            </h4>
            <Link
              href={menu.featuredImage.href}
              onClick={onClose}
              className="relative block h-[320px] w-full overflow-hidden rounded-2xl group bg-black"
            >
              <Image
                src={menu.featuredImage.src}
                alt={menu.featuredImage.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 300px"
              />
              {/* Gradient Overlay for Text Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent">
                <div className="absolute bottom-0 left-0 w-full p-6 text-center flex flex-col items-center justify-end h-full">
                  <span className="font-sans text-xl font-bold tracking-[0.15em] text-white uppercase drop-shadow-md mb-2">
                    {menu.featuredImage.brandLabel || "DISCOVER"}
                  </span>
                  {menu.featuredImage.description && (
                    <p className="text-white/80 text-[11px] leading-snug mb-4 max-w-[200px]">
                      {menu.featuredImage.description}
                    </p>
                  )}
                  <span className="inline-block px-5 py-1.5 border border-white/50 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300">
                    Discover
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}