// components/cards/product-tile.tsx
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BrandOffer } from "@/types/index";
import { Heart, ChevronRight } from "lucide-react";

interface ProductTileProps {
  offer: BrandOffer;
  showWishlist?: boolean;
  isWishlisted?: boolean;
  onWishlistToggle?: (id: string) => void;
  variant?: "brand" | "product";
  showExploreButton?: boolean;
}

export function ProductTile({ 
  offer, 
  showWishlist = false,
  isWishlisted = false,
  onWishlistToggle,
  variant = "brand",
  showExploreButton = false,
}: ProductTileProps) {
  const productId = offer.href.split('/').pop() || '';

  return (
    <div className="group flex flex-col gap-3 relative">
      <Link href={offer.href} className="block relative w-full overflow-hidden bg-gray-50">
        <div
          className={cn(
            "relative w-full",
            offer.size === "lg" ? "aspect-[4/5]" : "aspect-square"
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={offer.image}
            alt={offer.brand}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Wishlist Button */}
          {showWishlist && onWishlistToggle && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onWishlistToggle(productId);
              }}
              className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-md hover:scale-110 transition-transform z-10"
            >
              <Heart 
                className={cn(
                  "w-4 h-4 transition-colors",
                  isWishlisted ? "fill-[#DA1C5C] text-[#DA1C5C]" : "text-gray-600"
                )}
              />
            </button>
          )}

          {/* Tag/Badge */}
          {offer.tag && (
            <span className={cn(
              "absolute left-0 top-0 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-white z-10",
              variant === "brand" ? "bg-black/85" : "bg-[#DA1C5C]/90"
            )}>
              {offer.tag}
            </span>
          )}

          {/* EXPLORE Button */}
          {showExploreButton && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
              <span className="px-6 py-2.5 bg-white text-black text-[11px] font-semibold uppercase tracking-wider hover:bg-[#c9a84c] hover:text-white transition-colors flex items-center gap-1">
                EXPLORE <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          )}

          {/* Brand overlay */}
          {variant === "brand" && !showExploreButton && (
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-4 text-center text-lg font-semibold uppercase tracking-wide text-white">
              {offer.brand}
            </span>
          )}

          {/* Product info overlay */}
          {variant === "product" && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-3">
              <p className="text-xs text-white/80 uppercase tracking-wider truncate">
                {offer.brand}
              </p>
              <p className="text-sm font-medium text-white truncate">
                {offer.offerLabel}
              </p>
            </div>
          )}
        </div>
      </Link>

      {/* Footer text */}
      {variant === "brand" ? (
        <div className="text-center">
          <span className="text-sm font-medium uppercase tracking-wide text-gray-600">
            {offer.offerLabel}
          </span>
          {showExploreButton && (
            <span className="block text-xs text-[#c9a84c] font-medium mt-1 uppercase tracking-wider">
              DISCOVER
            </span>
          )}
        </div>
      ) : (
        <div className="space-y-0.5">
          <p className="text-xs uppercase tracking-[0.15em] text-[#DA1C5C] font-medium truncate">
            {offer.brand}
          </p>
          <p className="text-sm font-medium text-black truncate">
            {offer.offerLabel}
          </p>
        </div>
      )}
    </div>
  );
}