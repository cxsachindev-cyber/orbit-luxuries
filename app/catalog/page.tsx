// app/catalog/page.tsx
"use client"

import React, { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useStore } from "@/context/store-context"
import { ProductTile } from "@/components/cards/product-tile"
import { SlidersHorizontal, ChevronRight, X } from "lucide-react"
import { BrandOffer } from "@/types/index"

export default function CatalogPage() {
  const { products, wishlist, toggleWishlist } = useStore()
  const searchParams = useSearchParams()

  // State filtering engines
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [maxPrice, setMaxPrice] = useState<number>(5000000)
  const [sortBy, setSortBy] = useState<string>("popular")
  
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  // Handle URL parameter for category and brand filtering
  useEffect(() => {
    // Check for both "category" and "cat" to ensure compatibility with your dropdown
    const categoryParam = searchParams.get("category") || searchParams.get("cat")
    if (categoryParam) {
      setSelectedCategories([categoryParam])
    } else {
      setSelectedCategories([])
    }

    const brandParam = searchParams.get("brand")
    if (brandParam) {
      setSelectedBrands([brandParam])
    } else {
      setSelectedBrands([])
    }
  }, [searchParams])

  // Dynamically generate categories from your actual Firebase products
  const categories = useMemo(() => {
    const allCats = products.map(p => (p.category || "").trim());
    return Array.from(new Set(allCats)).filter(Boolean);
  }, [products]);

  // Dynamically generate brands from your actual Firebase products
  const brands = useMemo(() => {
    const allBrands = products.map(p => (p.brand || "").trim());
    return Array.from(new Set(allBrands)).filter(Boolean);
  }, [products]);

  const handleCategoryToggle = (cat: string) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])
  }

  const handleBrandToggle = (br: string) => {
    setSelectedBrands(prev => prev.includes(br) ? prev.filter(b => b !== br) : [...prev, br])
  }

  // Pure data filter-sorting logic loops
  const computedProducts = useMemo(() => {
    let output = [...products]

    // Search query filtering
    const searchQuery = searchParams.get("q")
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase()
      output = output.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.brand.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
      )
    }

    // Category filtering (Case-Insensitive)
    if (selectedCategories.length > 0) {
      output = output.filter(p => 
        selectedCategories.some(cat => 
          (p.category || "").toLowerCase().trim() === cat.toLowerCase().trim()
        )
      )
    }

    // Brand filtering (Case-Insensitive - THIS FIXES THE ROLEX ISSUE)
    if (selectedBrands.length > 0) {
      output = output.filter(p => 
        selectedBrands.some(brand => 
          (p.brand || "").toLowerCase().trim() === brand.toLowerCase().trim()
        )
      )
    }
    
    // Price filtering
    output = output.filter(p => p.price <= maxPrice)

    // Sorting
    if (sortBy === "low-to-high") output.sort((a, b) => a.price - b.price)
    if (sortBy === "high-to-low") output.sort((a, b) => b.price - a.price)
    
    return output
  }, [products, selectedCategories, selectedBrands, maxPrice, sortBy, searchParams])

  // Get the current category from URL for the title
  const currentCategory = useMemo(() => {
    const catParam = searchParams.get("category") || searchParams.get("cat")
    return catParam || null
  }, [searchParams])

  // Transform products to BrandOffer format
  const productOffers = useMemo<BrandOffer[]>(() => {
    return computedProducts.map((product) => ({
      id: product.id,
      href: `/catalog/${product.id}`,
      image: product.image || '/images/placeholder.jpg',
      brand: product.brand || 'Unknown Brand',
      offerLabel: `₹${product.price.toLocaleString()}`,
      tag: product.category || 'General',
      size: "md",
    }))
  }, [computedProducts])

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-12 py-6 sm:py-10 flex flex-col space-y-4 sm:space-y-6 text-left">
      
      {/* BREADCRUMB INDICATOR STRIP */}
      <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-neutral-400 flex items-center space-x-2 select-none">
        <span>Home</span> <ChevronRight className="w-3 h-3" />
        <span className="text-neutral-900 font-medium">
          {currentCategory ? `${currentCategory} Collection` : "Boutique Catalog"}
        </span>
      </div>

      {/* Dynamic Title based on Category */}
      <h1 className="text-2xl sm:text-3xl font-serif capitalize">
        {currentCategory ? `${currentCategory} Collection` : "All Products"}
        {currentCategory && (
          <span className="text-sm font-light text-neutral-400 ml-3">
            {productOffers.length} items
          </span>
        )}
      </h1>

      <div className="w-full flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
        
        {/* LEFT COMPONENT: STICKY ACCORDION FILTER SIDEBAR */}
        <aside className="w-full lg:w-64 shrink-0 bg-white border border-neutral-200 p-6 rounded-sm sticky top-36 hidden lg:block">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-6">
            <h3 className="text-xs uppercase tracking-widest font-bold flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#DA1C5C]" /> Filters
            </h3>
            {(selectedCategories.length > 0 || selectedBrands.length > 0) && (
              <button 
                onClick={() => { 
                  setSelectedCategories([]); 
                  setSelectedBrands([]);
                  if (window.history) {
                    const url = new URL(window.location.href);
                    url.searchParams.delete('category');
                    url.searchParams.delete('cat');
                    url.searchParams.delete('brand'); // Added brand deletion to fully clear
                    window.history.pushState({}, '', url);
                  }
                }} 
                className="text-[10px] text-[#DA1C5C] uppercase font-bold hover:underline bg-transparent border-0 cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>

          {/* CATEGORY BLOCK MAPS */}
          <div className="space-y-4 mb-8">
            <h4 className="text-[11px] uppercase tracking-wider font-bold text-neutral-400">Department</h4>
            <div className="flex flex-col space-y-2.5">
              {categories.map(cat => (
                <label key={cat} className="flex items-center space-x-3 text-xs text-neutral-700 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={selectedCategories.includes(cat)} 
                    onChange={() => handleCategoryToggle(cat)} 
                    className="accent-[#DA1C5C] w-3.5 h-3.5 rounded-xs" 
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* BRAND BLOCK MAPS */}
          <div className="space-y-4 mb-8">
            <h4 className="text-[11px] uppercase tracking-wider font-bold text-neutral-400">Designer Labels</h4>
            <div className="flex flex-col space-y-2.5">
              {brands.map(brand => (
                <label key={brand} className="flex items-center space-x-3 text-xs text-neutral-700 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={selectedBrands.includes(brand)} 
                    onChange={() => handleBrandToggle(brand)} 
                    className="accent-[#DA1C5C] w-3.5 h-3.5 rounded-xs" 
                  />
                  <span className="truncate">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* PRICE SLIDER MATRIX */}
          <div className="space-y-4">
            <div className="flex justify-between items-center text-[11px] uppercase tracking-wider font-bold text-neutral-400">
              <span>Price Cap</span>
              <span className="text-neutral-900">₹{maxPrice.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min="2000" 
              max="5000000" 
              step="5000" 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(Number(e.target.value))} 
              className="w-full accent-[#DA1C5C]" 
            />
          </div>
        </aside>

        {/* RIGHT COMPONENT: SORT CONTROLS + PRODUCT VIEWPORT GRID */}
        <section className="flex-grow w-full space-y-4 sm:space-y-6">
          
          {/* CONTROL STRIP */}
          <div className="w-full bg-neutral-50 border border-neutral-200 p-3 sm:p-4 flex flex-row items-center justify-between rounded-sm gap-2">
            <span className="text-[11px] sm:text-xs text-neutral-500 font-light truncate">
              Showing <strong className="text-neutral-900 font-medium">{productOffers.length}</strong> luxurious matches
            </span>
            
            <div className="flex items-center space-x-2 shrink-0">
              <button 
                onClick={() => setIsMobileFilterOpen(true)}
                className="inline-flex lg:hidden items-center justify-center gap-1.5 border border-neutral-300 bg-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-sm hover:border-neutral-900 transition-colors cursor-pointer select-none"
              >
                <SlidersHorizontal className="w-3 h-3 text-[#DA1C5C]" /> <span>Filter</span>
              </button>

              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)} 
                className="bg-black border border-neutral-300 rounded px-1.5 py-1.5 sm:px-2 focus:outline-none focus:border-neutral-900 text-[11px] sm:text-xs font-bold uppercase tracking-wide cursor-pointer h-[32px]"
              >
                <option value="popular">Popularity Index</option>
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* CATALOG DISPLAY PRODUCT GRID */}
          {productOffers.length === 0 ? (
            <div className="w-full text-center py-24 border border-dashed border-neutral-200 text-neutral-400 text-xs uppercase tracking-widest rounded-sm bg-neutral-50/50 font-medium">
              {currentCategory 
                ? `No products found in the ${currentCategory} category yet.` 
                : "Zero product matches align with chosen constraints."}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 w-full">
              {productOffers.map((offer) => (
                <ProductTile 
                  key={offer.id} 
                  offer={offer}
                  variant="product"
                  showWishlist={true}
                  isWishlisted={wishlist.includes(offer.id)}
                  onWishlistToggle={toggleWishlist}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* MOBILE OVERLAY DRAWER DIALOG PANEL */}
      <div className={`fixed inset-0 bg-neutral-950/50 z-50 transition-opacity duration-300 lg:hidden ${isMobileFilterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className={`fixed top-0 right-0 w-80 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col transition-transform duration-300 transform z-50 text-left ${isMobileFilterOpen ? "translate-x-0" : "translate-x-full"}`}>
          
          <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between shrink-0">
            <span className="text-xs font-black uppercase tracking-widest text-neutral-950 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#DA1C5C]" /> Refine Catalog
            </span>
            <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 text-neutral-500 hover:text-neutral-900 focus:outline-none bg-transparent border-0 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* CATEGORIES OVERLAY SECTION */}
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase tracking-widest font-black text-neutral-400">Department</h4>
              <div className="flex flex-col space-y-2.5">
                {categories.map(cat => (
                  <label key={cat} className="flex items-center space-x-3 text-xs text-neutral-700 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={selectedCategories.includes(cat)} 
                      onChange={() => handleCategoryToggle(cat)} 
                      className="accent-[#DA1C5C] w-4 h-4 rounded-xs" 
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* BRANDS OVERLAY SECTION */}
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase tracking-widest font-black text-neutral-400">Designer Labels</h4>
              <div className="flex flex-col space-y-2.5">
                {brands.map(brand => (
                  <label key={brand} className="flex items-center space-x-3 text-xs text-neutral-700 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={selectedBrands.includes(brand)} 
                      onChange={() => handleBrandToggle(brand)} 
                      className="accent-[#DA1C5C] w-4 h-4 rounded-xs" 
                    />
                    <span className="truncate">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* PRICE SLIDER OVERLAY SECTION */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-black text-neutral-400">
                <span>Price Cap</span>
                <span className="text-neutral-900 font-mono">Core: ₹{maxPrice.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="2000" 
                max="5000000" 
                step="5000" 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(Number(e.target.value))} 
                className="w-full accent-[#DA1C5C]" 
              />
            </div>
          </div>

          {/* BOTTOM PERSISTENT DISMISS ACTIONS BAR CONTAINER */}
          <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex gap-3 shrink-0">
            {(selectedCategories.length > 0 || selectedBrands.length > 0) && (
              <button 
                onClick={() => { 
                  setSelectedCategories([]); 
                  setSelectedBrands([]); 
                  setIsMobileFilterOpen(false);
                  if (window.history) {
                    const url = new URL(window.location.href);
                    url.searchParams.delete('category');
                    url.searchParams.delete('cat');
                    url.searchParams.delete('brand');
                    window.history.pushState({}, '', url);
                  }
                }} 
                className="flex-1 bg-white border border-neutral-300 text-neutral-700 text-[10px] uppercase font-bold tracking-widest py-3 rounded-xs cursor-pointer hover:bg-neutral-100"
              >
                Reset
              </button>
            )}
            <button 
              onClick={() => setIsMobileFilterOpen(false)}
              className="flex-1 bg-neutral-950 text-white text-[10px] uppercase font-bold tracking-widest py-3 rounded-xs cursor-pointer hover:bg-[#DA1C5C] transition-colors border-0 shadow-sm"
            >
              Apply Filter
            </button>
          </div>

        </div>
      </div>

    </div>
  )
}