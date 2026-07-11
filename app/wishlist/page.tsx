// app/wishlist/page.tsx
"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useStore } from "@/context/store-context";
import { WishlistCard } from "@/components/cards/wishlist-card";
import { Heart, ArrowRight, Loader2 } from "lucide-react";

export default function WishlistPage() {
  const { products, wishlist, authLoading, toggleWishlist, addToCart } = useStore();

  // ✅ All hooks must be called BEFORE any conditional returns
  const wishlistedProducts = useMemo(() => {
    return products.filter(p => wishlist.includes(p.id));
  }, [products, wishlist]);

  const missingProducts = useMemo(() => {
    return wishlist.filter(id => !products.some(p => p.id === id));
  }, [wishlist, products]);

  // Handle add to cart
  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const defaultSize = product.sizes?.[0] || "";
      addToCart(product, defaultSize);
    }
  };

  // 🛡️ LOADING FIREWALL LAYER - AFTER all hooks
  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-2">
        <Loader2 className="w-8 h-8 animate-spin text-[#DA1C5C]" />
        <p className="text-xs text-neutral-400 uppercase tracking-widest font-semibold">Opening Secure Luxury Vault...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-12 py-12 text-left animate-fade-in min-h-[60vh] space-y-8">
      <div className="border-b border-neutral-200 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif uppercase tracking-wider font-extrabold flex items-center gap-3 text-neutral-900">
            <Heart className="w-7 h-7 text-[#DA1C5C] fill-[#DA1C5C]" /> My Luxury Vault
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            {wishlistedProducts.length} of {wishlist.length} items available
            {missingProducts.length > 0 && (
              <span className="text-amber-500 ml-2">
                ({missingProducts.length} items no longer available)
              </span>
            )}
          </p>
        </div>
        {wishlist.length > 0 && (
          <button
            onClick={() => {
              if (confirm("Remove all items from wishlist?")) {
                wishlist.forEach(id => toggleWishlist(id));
              }
            }}
            className="text-xs text-neutral-400 hover:text-red-500 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-neutral-200 rounded-sm bg-neutral-50/50 space-y-4">
          <p className="text-xs uppercase tracking-widest text-neutral-400 font-medium">
            {wishlist.length > 0 ? "Your wishlist items are no longer available" : "Your vault is currently vacant."}
          </p>
          <Link href="/catalog" className="text-xs bg-neutral-950 text-white font-bold uppercase tracking-widest px-5 py-3 inline-flex items-center gap-2 hover:bg-[#DA1C5C] transition-colors">
            Browse Boutique Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistedProducts.map((product) => (
            <WishlistCard
              key={product.id}
              id={product.id}
              name={product.name}
              brand={product.brand}
              price={product.price}
              image={product.image}
              onRemove={toggleWishlist}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}

      {/* Show missing products notice */}
      {missingProducts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
          <p className="text-sm text-amber-700">
            ⚠️ {missingProducts.length} item(s) in your wishlist are no longer available in our catalog.
            They will be removed automatically when you clear your wishlist.
          </p>
        </div>
      )}
    </div>
  );
}