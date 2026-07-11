// components/shared/brands-mega-menu.tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { MegaMenuData } from "@/types/index";
import { useStore } from "@/context/store-context";

interface BrandsMegaMenuProps {
  data: MegaMenuData;
  onClose: () => void;
}

export function BrandsMegaMenu({ data, onClose }: BrandsMegaMenuProps) {
  const [searchTerm, setSearchTerm] = useState("");
  // ✅ Default to our new dynamic "All Brands" tab
  const [activeTab, setActiveTab] = useState<string>("All Brands"); 
  
  // ✅ 1. PULL LIVE DATA FROM FIREBASE (via store)
  const { products } = useStore();

  // ✅ 2. DYNAMICALLY EXTRACT & SORT EVERY UNIQUE BRAND FROM PRODUCTS
  const liveBrands = useMemo(() => {
    // Extract brands, remove empty ones, and clean up whitespace
    const brandsArray = products.map(p => (p.brand || "").trim()).filter(Boolean);
    // Remove duplicates by using a Set, then sort alphabetically
    const uniqueBrands = Array.from(new Set(brandsArray)).sort();
    
    // Format them for the links
    return uniqueBrands.map(brand => ({
      label: brand,
      href: `/catalog?brand=${encodeURIComponent(brand.toLowerCase())}`
    }));
  }, [products]);

  // 3. EXTRACT CURATED TABS FROM MEGAMENU.TS (For Featured/Exclusive)
  const brandsMenu = data["Brands"];
  const curatedTabs = brandsMenu?.columns || [];
  
  // Combine dynamic "All Brands" with your static curated tabs
  const tabs = ["All Brands", ...curatedTabs.map(col => col.heading)];

  // 4. FILTERING & SORTING FOR LEFT SIDEBAR (Using LIVE BRANDS!)
  const filteredBrands = useMemo(() => {
    if (!searchTerm) return liveBrands;
    return liveBrands.filter(brand => 
      brand.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [liveBrands, searchTerm]);

  // Group live brands by first letter
  const brandsByLetter = useMemo(() => {
    const grouped = filteredBrands.reduce((acc, brand) => {
      const firstLetter = brand.label.charAt(0).toUpperCase();
      // Handle numbers/symbols by grouping them into "#"
      const key = /[A-Z]/.test(firstLetter) ? firstLetter : "#";
      
      if (!acc[key]) acc[key] = [];
      acc[key].push(brand);
      return acc;
    }, {} as Record<string, typeof liveBrands>);
    
    return grouped;
  }, [filteredBrands]);

  const alphabet = ["#", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];
  const availableLetters = Object.keys(brandsByLetter);
  const hasBrands = (letter: string) => availableLetters.includes(letter);

  // 5. GET ACTIVE GRID BRANDS FOR RIGHT PANEL
  const activeGridBrands = useMemo(() => {
    if (activeTab === "All Brands") {
      return liveBrands; // Dynamically show everything in Firebase!
    }
    // Otherwise, show the curated list from megamenu.ts
    const activeColumn = curatedTabs.find(col => col.heading === activeTab);
    return activeColumn ? activeColumn.links : [];
  }, [activeTab, liveBrands, curatedTabs]);

  return (
    <div
      className="absolute left-0 top-full w-full border-t border-white/10 bg-[#121212] text-white shadow-2xl animate-fade-in z-40 max-h-[75vh] flex overflow-hidden"
      onMouseLeave={onClose}
    >
      {/* =========================================
          LEFT SIDEBAR: SEARCH & LIVE A-Z LIST
      ========================================= */}
      <div className="w-[320px] shrink-0 border-r border-white/10 flex flex-col bg-[#0a0a0a]">
        
        <div className="p-6 pb-4 border-b border-white/5">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Live Catalog..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-md py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#c9a84c] transition-colors"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative flex">
          <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10">
            {searchTerm && filteredBrands.length === 0 ? (
              <div className="text-white/40 text-sm text-center py-8">
                No brands found matching "{searchTerm}"
              </div>
            ) : (
              Object.keys(brandsByLetter).sort().map((letter) => (
                <div key={letter} id={`brand-${letter}`} className="scroll-mt-4">
                  <h4 className="text-lg font-serif font-bold text-[#c9a84c] mb-3">{letter}</h4>
                  <ul className="space-y-3">
                    {brandsByLetter[letter].map((brand) => (
                      <li key={brand.label}>
                        <Link 
                          href={brand.href} 
                          onClick={onClose} 
                          className="text-[13px] text-white/70 hover:text-white transition-colors block truncate"
                        >
                          {brand.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>

          <div className="w-8 shrink-0 flex flex-col items-center justify-start py-4 space-y-1 overflow-y-auto text-[10px] font-bold text-white/30 [&::-webkit-scrollbar]:hidden border-l border-white/5 bg-[#050505]">
            {alphabet.map(letter => {
              const active = hasBrands(letter);
              return (
                <a 
                  key={letter} 
                  href={`#brand-${letter}`}
                  onClick={(e) => { if (!active) e.preventDefault(); }}
                  className={`w-full text-center py-1 transition-all ${
                    active 
                      ? "hover:text-[#c9a84c] hover:scale-125 cursor-pointer text-white/70" 
                      : "cursor-not-allowed opacity-30"
                  }`}
                >
                  {letter}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================
          RIGHT MAIN AREA: DYNAMIC GRID & TABS
      ========================================= */}
      <div className="flex-1 flex flex-col bg-[#121212]">
        
        <div className="flex items-center gap-3 px-10 pt-8 pb-5 border-b border-white/5 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-[11px] sm:text-xs font-bold tracking-widest uppercase transition-all border cursor-pointer ${
                activeTab === tab 
                  ? "bg-white text-black border-white" 
                  : "bg-transparent text-white/50 border-white/10 hover:border-white/30 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-10 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#c9a84c]/50 hover:[&::-webkit-scrollbar-thumb]:bg-[#c9a84c]">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {activeGridBrands.map((brand, idx) => (
              <Link
                key={idx}
                href={brand.href}
                onClick={onClose}
                className="group relative flex items-center justify-center h-[100px] bg-[#1a1a1a] rounded-lg border border-white/5 hover:border-[#c9a84c] transition-all duration-300 overflow-hidden"
              >
                <span className="font-serif text-sm font-bold tracking-widest uppercase text-white/60 group-hover:text-white transition-colors text-center px-4">
                  {brand.label}
                </span>
              </Link>
            ))}
          </div>
          
          {activeGridBrands.length === 0 && (
            <div className="flex items-center justify-center h-full text-white/40 text-sm uppercase tracking-widest">
              No brands found in this category.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}