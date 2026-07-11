import React from "react";
import Link from "next/link";

// Notice how we receive BOTH the brand and collection from the URL
export default function ExploreCollectionPage({ 
  params 
}: { 
  params: { brand: string, collection: string } 
}) {
  
  // Format the text for the screen
  const brandName = params.brand.charAt(0).toUpperCase() + params.brand.slice(1);
  const collectionName = params.collection.toUpperCase(); // e.g., BZERO1

  return (
    <main className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-6 text-center">
        
        {/* Breadcrumb style sub-heading */}
        <span className="text-xs font-bold uppercase tracking-widest text-[#c9a84c] mb-4 block">
          {brandName} Collection Showcase
        </span>
        
        {/* Main Collection Title */}
        <h1 className="text-4xl md:text-5xl font-serif mb-6 text-black tracking-wide">
          {collectionName}
        </h1>
        
        <p className="text-gray-500 max-w-2xl mx-auto mb-10">
          Discover the iconic {collectionName} collection by {brandName}. This dedicated showcase is currently being curated with our finest pieces.
        </p>
        
        {/* Smart Link that passes BOTH filters back to your catalog */}
        <Link 
          href={`/catalog?brand=${params.brand}&collection=${params.collection}`} 
          className="inline-block bg-black text-white text-xs font-bold uppercase tracking-widest py-3 px-8 hover:bg-[#c9a84c] transition-colors"
        >
          Shop {collectionName}
        </Link>
        
      </div>
    </main>
  );
}