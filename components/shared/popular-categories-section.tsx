// components/shared/popular-categories-section.tsx
"use client";

import { CategoryCircle } from "@/components/cards/category-circle";
import { useStore } from "@/context/store-context";
import { useMemo, useEffect, useState } from "react";

// ✅ Define FALLBACK_CATEGORIES outside the component
const FALLBACK_CATEGORIES = [
  { id: "cat-fashion", label: "Fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80", href: "/catalog?category=Fashion" },
  { id: "cat-footwear", label: "Footwear", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80", href: "/catalog?category=Footwear" },
  { id: "cat-accessories", label: "Accessories", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80", href: "/catalog?category=Accessories" },
  { id: "cat-watches", label: "Watches", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&q=80", href: "/catalog?category=Watches" },
  { id: "cat-beauty", label: "Beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80", href: "/catalog?category=Beauty" },
  { id: "cat-home", label: "Home", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80", href: "/catalog?category=Home" },
];

// ✅ Define the image map outside the component
const CATEGORY_IMAGE_MAP: Record<string, string> = {
  'Fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80',
  'Footwear': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80',
  'Accessories': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80',
  'Home & Kitchen': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
  'Beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
  'Gadgets': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80',
  'Watches': 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&q=80',
  'Jewelry': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80',
  'Jewellery': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80',
  "Men's Accessories": 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80',
  'Kids': 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=400&q=80',
  'Home': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
  'Indiluxe': 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&q=80',
  'Eyewear': 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&q=80',
  'Beauty & Fragrances': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
  'Clothing': 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80',
  'Shoes': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80',
  'Bags': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80',
  'Perfumes': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
  'Skincare': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
};

// ✅ Helper function defined outside the component
const getCategoryImage = (category: string): string => {
  return CATEGORY_IMAGE_MAP[category] || 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80';
};

export function PopularCategoriesSection() {
  const { products, authLoading } = useStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ✅ Get unique categories from actual products
  const categories = useMemo(() => {
    // If products are loaded and have categories, use them
    if (products && products.length > 0) {
      const uniqueCategories = [...new Set(products.map(p => p.category))].filter(Boolean);
      
      if (uniqueCategories.length > 0) {
        return uniqueCategories.map((cat, index) => ({
          id: `cat-${index}`,
          label: cat as string,
          image: getCategoryImage(cat as string),
          href: `/catalog?category=${encodeURIComponent(cat as string)}`,
        }));
      }
    }
    
    // ✅ Return fallback categories if no products
    return FALLBACK_CATEGORIES;
  }, [products]);

  // ✅ Don't render on server (hydration safety)
  if (!isMounted) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-6 px-6 sm:grid-cols-3 lg:grid-cols-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-full bg-gray-200 w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-16 mx-auto mt-3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ✅ Show loading state
  if (authLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-6 px-6 sm:grid-cols-3 lg:grid-cols-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-full bg-gray-200 w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-16 mx-auto mt-3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ✅ Always show something (fallback categories if no products)
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="font-serif text-3xl font-semibold text-black">
          Popular Categories
        </h2>
        <p className="mt-3 text-gray-600">Everything to shop from, chosen with love</p>
      </div>

      <div className="container mx-auto mt-10 grid grid-cols-2 gap-x-6 gap-y-10 px-6 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((cat) => (
          <CategoryCircle key={cat.id} item={cat} />
        ))}
      </div>
    </section>
  );
}