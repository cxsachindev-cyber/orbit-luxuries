// components/shared/hero-carousel.tsx
"use client";

import { useEffect, useState } from "react";
import { getHeroSlides, getHeroSideAd } from "@/lib/data/hero";
import { HeroCarouselClient } from "./hero-carousel-client";

// ✅ Match the exact types from hero-carousel-client.tsx
interface HeroSlide {
  id: string;
  image: string;
  href: string;
  alt: string;
  title?: string;
  subtitle?: string;
  cta?: string;
}

interface SideAd {
  id: string;
  image: string;
  href: string;
  alt: string;
  title?: string;
  subtitle?: string;
  cta?: string;
}

export function HeroCarousel() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [sideAd, setSideAd] = useState<SideAd | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [heroSlides, heroSideAd] = await Promise.all([
          getHeroSlides(),
          getHeroSideAd(),
        ]);
        
        // ✅ Ensure we have valid data
        setSlides(Array.isArray(heroSlides) ? heroSlides : []);
        setSideAd(heroSideAd || null);
      } catch (error) {
        console.error("Error loading hero data:", error);
        setSlides([]);
        setSideAd(null);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[500px] md:h-[600px] lg:h-[700px] bg-gray-200 animate-pulse flex items-center justify-center">
        <span className="text-gray-400">Loading...</span>
      </div>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  return <HeroCarouselClient slides={slides} sideAd={sideAd} />;
}