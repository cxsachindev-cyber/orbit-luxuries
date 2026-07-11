// components/shared/top-brands-section.tsx
"use client";

import { ProductTile } from "@/components/cards/product-tile";
import { useStore } from "@/context/store-context";
import { useMemo } from "react";

export function TopBrandsSection() {
  const { products, authLoading } = useStore();

  // ✅ Get unique brands with product data
  const topBrands = useMemo(() => {
    if (!products || products.length === 0) {
      return [];
    }

    const brandMap = new Map();
    
    products.forEach(product => {
      if (!brandMap.has(product.brand) && product.brand) {
        brandMap.set(product.brand, {
          id: `brand-${product.brand}`,
          href: `/catalog?brand=${encodeURIComponent(product.brand)}`,
          image: product.image,
          brand: product.brand,
          offerLabel: `₹${product.price.toLocaleString()}`,
          tag: product.category,
          size: "lg",
        });
      }
    });
    
    return Array.from(brandMap.values()).slice(0, 3);
  }, [products]);

  // ✅ More brands (second row)
  const moreBrands = useMemo(() => {
    if (!products || products.length === 0) {
      return [];
    }

    const brandMap = new Map();
    
    products.forEach(product => {
      if (!brandMap.has(product.brand) && product.brand) {
        brandMap.set(product.brand, {
          id: `brand-${product.brand}`,
          href: `/catalog?brand=${encodeURIComponent(product.brand)}`,
          image: product.image,
          brand: product.brand,
          offerLabel: `₹${product.price.toLocaleString()}`,
          tag: product.category,
          size: "md",
        });
      }
    });
    
    return Array.from(brandMap.values()).slice(3, 9);
  }, [products]);

  // ✅ Show loading state
  if (authLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  // ✅ Show nothing if no brands
  if (topBrands.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="font-serif text-3xl font-semibold text-black">
          Top Brands, on Offer
        </h2>
      </div>

      <div className="container mx-auto mt-10 grid grid-cols-1 gap-6 px-6 sm:grid-cols-3">
        {topBrands.map((offer, index) => (
          <ProductTile 
            key={offer.id} 
            offer={offer} 
            showExploreButton={index === 1}
          />
        ))}
      </div>

      {moreBrands.length > 0 && (
        <>
          <div className="container mx-auto mt-16 px-6 text-center">
            <h2 className="font-serif text-3xl font-semibold text-black">
              More Brands On Offer
            </h2>
          </div>

          <div className="container mx-auto mt-10 grid grid-cols-2 gap-6 px-6 sm:grid-cols-3 lg:grid-cols-6">
            {moreBrands.map((offer) => (
              <ProductTile key={offer.id} offer={offer} showExploreButton />
            ))}
          </div>
        </>
      )}
    </section>
  );
}