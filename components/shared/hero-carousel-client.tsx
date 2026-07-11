// components/shared/hero-carousel-client.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface HeroCarouselClientProps {
  slides: HeroSlide[];
  sideAd: SideAd | null; // Kept in props to avoid breaking parent components, but we will ignore it in the UI
}

export function HeroCarouselClient({ slides }: HeroCarouselClientProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const totalSlides = slides.length;

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="relative w-full overflow-hidden bg-luxe-black">
      <div 
        className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
          >
            <Link href={slide.href} className="block relative w-full h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover"
              />
              
              {/* Left-aligned gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent">
                <div className="absolute inset-y-0 left-0 w-full md:w-2/3 lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 text-white">
                  {slide.title && (
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium tracking-wide mb-4">
                      {slide.title}
                    </h2>
                  )}
                  {slide.subtitle && (
                    <p className="text-base md:text-xl font-sans text-white/90 mb-8 max-w-md leading-relaxed">
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.cta && (
                    <div>
                      <span className="inline-block px-8 py-3 border border-white text-white text-sm font-semibold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-colors duration-300">
                        {slide.cta}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}

        {/* Navigation Arrows - Rounded Squares */}
        <button
          onClick={goToPrev}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-md transition-all shadow-sm z-20"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-md transition-all shadow-sm z-20"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Pagination Dots - Circular */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex justify-center gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                goToSlide(index);
              }}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                index === currentSlide
                  ? "bg-white scale-125"
                  : "bg-white/40 hover:bg-white/70"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}