"use client"

import React, { useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { useStore } from "@/context/store-context"
import { ShoppingBag, ChevronRight, CheckCircle, Heart } from "lucide-react"

export default function ProductDetailPage() {
  const { productId } = useParams()
  const router = useRouter()
  const { products, addToCart, toggleWishlist, wishlist } = useStore()

  const product = useMemo(() => products.find((p) => p.id === productId), [products, productId])
  const [activeImg, setActiveImg] = useState<string>(product?.image || "")
  const [chosenSize, setChosenSize] = useState<string>("")
  const [errorPrompt, setErrorPrompt] = useState<boolean>(false)
  const [successState, setSuccessState] = useState<boolean>(false)

  if (!product) {
    return (
      <div className="w-full text-center py-32 text-xs uppercase tracking-widest text-neutral-400">
        Product configuration not found within active cache bounds.
      </div>
    )
  }

  const isWishlisted = wishlist.includes(product.id)

  // ✅ FIXED: Only enforce size selection if the product actually has sizes to choose from!
  const handleBagAddition = () => {
    if (product.sizes && product.sizes.length > 0 && !chosenSize) {
      setErrorPrompt(true)
      return
    }
    setErrorPrompt(false)
    addToCart(product, chosenSize)
    setSuccessState(true)
    setTimeout(() => setSuccessState(false), 2500)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-12 py-12 flex flex-col space-y-8 animate-fade-in">
      <div className="text-[11px] uppercase tracking-wider text-neutral-400 flex items-center space-x-2">
        <span>Home</span> <ChevronRight className="w-3 h-3" />
        <span>{product.category}</span> <ChevronRight className="w-3 h-3" />
        <span className="text-neutral-900 font-medium truncate max-w-xs">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7 grid grid-cols-12 gap-4">
          <div className="col-span-2 flex flex-col space-y-3">
            {product.images?.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActiveImg(img)}
                className={`aspect-[3/4] border cursor-pointer overflow-hidden rounded-xs bg-neutral-50 transition-all ${activeImg === img ? "border-neutral-950 ring-1 ring-neutral-950" : "border-neutral-200"}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="col-span-10 aspect-[3/4] relative bg-neutral-50 border border-neutral-200 rounded overflow-hidden group">
            <img src={activeImg || product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6 text-left">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-[0.2em] text-[#DA1C5C] font-black">{product.brand}</span>
            <h1 className="text-xl lg:text-3xl font-serif text-neutral-900 leading-tight font-light">{product.name}</h1>
          </div>

          <div className="flex items-baseline space-x-4 border-y border-neutral-100 py-4">
            <span className="text-2xl font-bold text-neutral-950"> must-have variant / ₹{product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-neutral-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>

          <p className="text-xs text-neutral-600 font-light leading-relaxed font-sans">{product.description}</p>

          {/* SIZES SELECTION MATRIX - Only render if sizes exist */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-xs font-semibold uppercase tracking-wider">
                <span>Select Luxury Metric</span>
                {errorPrompt && <span className="text-[#DA1C5C] lowercase font-normal">Metric parameter required</span>}
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => { setChosenSize(size); setErrorPrompt(false) }}
                    className={`px-4 py-2.5 text-xs font-bold uppercase transition-all rounded-xs border tracking-wider ${chosenSize === size ? "bg-neutral-950 text-white border-neutral-950" : "bg-white text-neutral-800 border-neutral-300 hover:border-neutral-900"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={handleBagAddition}
              className="flex-grow flex items-center justify-center gap-2 bg-[#DA1C5C] text-white text-xs font-bold uppercase tracking-widest py-4 hover:bg-[#b5144b] transition-colors shadow-lg shadow-[#DA1C5C]/10 rounded-sm"
            >
              <ShoppingBag className="w-4 h-4" /> Add to Shopping Bag
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`px-6 py-4 border text-xs font-bold uppercase tracking-widest rounded-sm transition-colors flex items-center justify-center gap-1 ${isWishlisted ? "border-[#DA1C5C] text-[#DA1C5C] bg-red-50/20" : "border-neutral-300 hover:border-neutral-900 text-neutral-800"}`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? "fill-[#DA1C5C]" : ""}`} /> Wishlist
            </button>
          </div>

          {successState && (
            <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs py-3 px-4 flex items-center gap-2 rounded-sm animate-fade-in">
              <CheckCircle className="w-4 h-4" /> Item mapped cleanly into client shopping bag vector layout.
            </div>
          )}

          <div className="border-t border-neutral-200 pt-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Specifications Ledger</h3>
            <ul className="space-y-1.5 text-xs font-light text-neutral-700 list-inside list-disc">
              {product.specs?.map((spec, i) => (
                <li key={i}>{spec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}