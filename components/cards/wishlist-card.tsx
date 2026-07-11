// components/cards/wishlist-card.tsx
"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingBag, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface WishlistCardProps {
  id: string
  name: string
  brand: string
  price: number
  image: string
  onRemove: (id: string) => void
  onAddToCart: (id: string) => void
}

export function WishlistCard({
  id,
  name,
  brand,
  price,
  image,
  onRemove,
  onAddToCart,
}: WishlistCardProps) {
  return (
    <div className="group relative bg-white border border-neutral-200 rounded-sm overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/catalog/${id}`}>
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
          <Image
            src={image || '/images/placeholder.jpg'}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 16vw, 45vw"
          />
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onRemove(id)
            }}
            className="absolute top-3 right-3 p-1.5 bg-white/90 rounded-full shadow-md hover:bg-[#DA1C5C] hover:text-white transition-all border-0 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </Link>

      <div className="p-4 space-y-2">
        <Link href={`/catalog/${id}`}>
          <p className="text-xs uppercase tracking-[0.15em] text-[#DA1C5C] font-medium truncate">
            {brand}
          </p>
          <h3 className="text-sm font-medium text-neutral-900 truncate">
            {name}
          </h3>
          <p className="text-sm font-semibold text-neutral-900">
            ₹{price.toLocaleString()}
          </p>
        </Link>

        <button
          onClick={() => onAddToCart(id)}
          className="w-full flex items-center justify-center gap-2 bg-neutral-950 text-white text-xs font-bold uppercase tracking-widest py-2.5 rounded-sm hover:bg-[#DA1C5C] transition-colors border-0 cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5" /> Add to Bag
        </button>
      </div>
    </div>
  )
}