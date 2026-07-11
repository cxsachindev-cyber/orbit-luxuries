// app/explore/[brand]/page.tsx
import React from "react";
import Link from "next/link";

export default function ExploreBrandPage({ params }: { params: { brand: string } }) {
  // Extract the brand name from the URL (e.g., "bvlgari", "timevallee")
  const brandSlug = params.brand;
  
  // Format the brand name for the header (e.g., "bvlgari" -> "Bvlgari")
  const formattedBrandName = brandSlug.charAt(0).toUpperCase() + brandSlug.slice(1).replace("-", " ");

  return (
    <main className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-6 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-[#c9a84c] mb-4 block">
          Brand Spotlight
        </span>
        <h1 className="text-4xl md:text-5xl font-serif mb-6 text-black">
          {formattedBrandName}
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto mb-10">
          Welcome to the exclusive showcase for {formattedBrandName}. We are currently curating the finest pieces for this collection. Please check back soon.
        </p>
        
        <Link 
          href="/catalog" 
          className="inline-block bg-black text-white text-xs font-bold uppercase tracking-widest py-3 px-8 hover:bg-[#c9a84c] transition-colors"
        >
          Return to Catalog
        </Link>
      </div>
    </main>
  );
}