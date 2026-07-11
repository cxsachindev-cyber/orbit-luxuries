"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useStore } from "@/context/store-context"
import { ShoppingBag, Heart, ArrowLeft } from "lucide-react"

export default function CustomerBrandPage() {
  const { brandName } = useParams()
  const { products = [], toggleWishlist, wishlist } = useStore()
  
  // Create a mapping of URL-friendly names to actual brand names
  const brandMapping: Record<string, string> = {
    "us-polo-assn": "U.S. Polo Assn.",
    "levis": "Levi's",
    "nike": "Nike",
    "orbit-luxuries": "Orbit Luxuries Collection",
    "premium-design": "Premium Design",
    "titan": "Titan",
    "casio": "Casio",
    "fossil": "Fossil",
    "puma": "Puma",
    "adidas": "Adidas",
    "skechers": "Skechers",
    "clarks": "Clarks",
    "aldo": "Aldo",
    "tanishq": "Tanishq",
    "malabar-gold": "Malabar Gold",
    "giva-silver": "Giva Silver",
    "voylla": "Voylla",
    "daali": "Daali",
    "utsa": "Utsa",
    "w": "W",
    "biba": "Biba",
    "forever-new": "Forever New",
    "vark": "Vark",
    "libas": "Libas",
    "lov": "LOV",
    "varanga": "Varanga",
    "aurelia": "Aurelia",
    "rare-rabbit": "Rare Rabbit",
    "mufti": "Mufti",
    "blackberrys": "Blackberrys",
    "westside": "WESTSIDE",
    "lifestyle": "LIFESTYLE",
    "puma-active": "PUMA ACTIVE",
    "metro-couture": "METRO COUTURE",
    "mochi": "MOCHI",
    "amrapali": "AMRAPALI",
    "zaveri": "ZAVERI",
    "tommy-watches": "TOMMY WATCHES",
    "michael-kors": "MICHAEL KORS",
    "gini-and-jony": "Gini & Jony",
    "mothercare": "Mothercare",
    "hopscotch": "Hopscotch",
    "cucumber": "Cucumber",
    "lilliput": "LILLIPUT",
    "benetton-kids": "BENETTON KIDS",
    "luxury": "Luxury Brands"
  }
  
  // Get the actual brand name from the mapping
  const brandKey = typeof brandName === 'string' ? brandName.toLowerCase() : ''
  const actualBrandName = brandMapping[brandKey] || brandKey.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  
  // Filter products by brand (exact match, case-insensitive)
  const brandProducts = products.filter((product: any) => {
    const productBrand = product.brand?.toLowerCase().trim()
    const targetBrand = actualBrandName.toLowerCase().trim()
    return productBrand === targetBrand
  })
  
  console.log("Looking for brand:", actualBrandName)
  console.log("Found products:", brandProducts.length)
  console.log("All product brands:", products.map(p => p.brand))

  // Get display brand name
  const displayBrandName = actualBrandName

  // Empty state - no products found
  if (brandProducts.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-neutral-400" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">{displayBrandName}</h1>
          <p className="text-neutral-500 mb-6">
            We couldn't find any products from {displayBrandName} at the moment.
            Please check back later for new arrivals.
          </p>
          <p className="text-xs text-neutral-400 mb-4">
            Available brands: {products.map(p => p.brand).join(', ')}
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#DA1C5C] text-white text-sm font-semibold rounded-sm hover:bg-[#b8144a] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  // Products found - display them
  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-12 py-8">
      <div className="mb-8 pb-4 border-b border-neutral-200">
        <h1 className="text-3xl font-bold text-neutral-900 uppercase tracking-wider">
          {displayBrandName}
        </h1>
        <p className="text-neutral-500 text-sm mt-2">
          {brandProducts.length} {brandProducts.length === 1 ? 'product' : 'products'} available
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {brandProducts.map((product: any) => (
          <div key={product.id} className="group cursor-pointer">
            <Link href={`/catalog/${product.id}`}>
              <div className="relative aspect-square bg-neutral-100 rounded-sm overflow-hidden mb-3">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button 
                  onClick={(e) => {
                    e.preventDefault()
                    toggleWishlist(product.id)
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-[#DA1C5C] text-[#DA1C5C]' : 'text-neutral-600'}`} />
                </button>
              </div>
              <h3 className="font-medium text-neutral-800 text-sm line-clamp-1">{product.name}</h3>
              <p className="text-neutral-500 text-xs mt-0.5">{product.brand}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[#DA1C5C] font-bold text-sm">₹{product.price.toLocaleString('en-IN')}</span>
                <span className="text-neutral-400 text-xs line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}