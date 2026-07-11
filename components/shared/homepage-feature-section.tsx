// components/homepage-feature-section.tsx
import { BrandLogoStrip } from "./brand-logo-strip";
import { PromoBannerSection } from "./promo-banner-section";
import {
  getBvlgariLines,
  getWatchMaisonStrip,
  getFashionBrandStrip,
  getApparelBrandStrip,
} from "@/lib/data/feature-section";
import { useState, useEffect } from "react";

export function BvlgariFocusSection() {
  const [bvlgariLines, setBvlgariLines] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBvlgariLines();
        setBvlgariLines(data);
      } catch (error) {
        console.error("Failed to load Bvlgari lines:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <PromoBannerSection
        title="Bvlgari In Focus"
        subtitle="Exquisite creations capturing brilliance in every detail"
        image="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=80"
        imageAlt="Bvlgari jewelry"
        href="/explore/bvlgari"
        brandLabel="BVLGARI"
        description="The ultimate statement of refined elegance and femininity"
        imagePosition="left"
        dark
        showDiscover
      />
      <div className="container mx-auto -mt-6 grid grid-cols-2 gap-6 px-6 pb-16 lg:grid-cols-4">
        {bvlgariLines.map((line) => (
          <a key={line.id} href={line.href} className="group flex flex-col items-center gap-4">
            <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={line.image}
                alt={line.label}
                className="absolute inset-0 h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <span className="font-serif text-lg">{line.label}</span>
          </a>
        ))}
      </div>
    </>
  );
}

export function LuxuryLegendsSection() {
  const [watchMaisons, setWatchMaisons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWatchMaisonStrip();
        setWatchMaisons(data);
      } catch (error) {
        console.error("Failed to load watch maisons:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-white flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      {/* 1. Grid of full-bleed watch brand cards moved to the top */}
      <div className="container mx-auto px-6 mb-16">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-6">
          {watchMaisons.map((brand) => (
            <a 
              key={brand.id} 
              href={brand.href} 
              className="group relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition-transform duration-500 hover:-translate-y-1 hover:shadow-md block"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={brand.image}
                alt={brand.label}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Dark gradient overlay for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 w-full p-5 text-center flex flex-col justify-end h-full">
                  <span className="font-sans text-sm font-bold tracking-widest text-white uppercase drop-shadow-md">
                    {brand.label}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 2. Heading moved below the grid */}
      <div className="container mx-auto px-6 text-center mb-10">
        <h2 className="font-serif text-3xl font-semibold text-black">Luxury Legends</h2>
        <p className="mt-3 text-gray-500">Timepieces shaped by enduring horological excellence</p>
      </div>

      {/* 3. Promo Banner */}
      <PromoBannerSection
        title=""
        subtitle=""
        image="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200&q=80"
        imageAlt="TimeVallée luxury watches"
        href="/explore/timevallee"
        brandLabel="TIMEVALLÉE"
        description="A unique destination for all watch lovers"
        imagePosition="center"
        showDiscover
      />
    </section>
  );
}

export function SpotlightOnSection() {
  const [fashionBrands, setFashionBrands] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFashionBrandStrip();
        setFashionBrands(data);
      } catch (error) {
        console.error("Failed to load fashion brands:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-white flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="font-serif text-3xl font-semibold text-black">Spotlight On</h2>
        <p className="mt-3 text-gray-500">New-season pieces from the world&apos;s best fashion brands</p>
      </div>

      <PromoBannerSection
        title=""
        subtitle=""
        image="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80"
        imageAlt="The Collective fashion"
        href="/explore/the-collective"
        brandLabel="THE COLLECTIVE"
        description="Designer drops, cult classics, and fashion's finest"
        imagePosition="left"
        showDiscover
      />

      <div className="container mx-auto mt-10 px-6">
        <BrandLogoStrip items={fashionBrands} variant="text" />
      </div>
    </section>
  );
}

export function LuxuryReconsideredSection() {
  const [apparelBrands, setApparelBrands] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const data = await getApparelBrandStrip();
        setApparelBrands(data);
      } catch (error) {
        console.error("Failed to load apparel brands:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBrands();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-white flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      {/* 1. Grid of full-bleed brand cards moved to the top */}
      <div className="container mx-auto px-6 mb-16">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-6">
          {apparelBrands.map((brand) => (
            <a 
              key={brand.id} 
              href={brand.href} 
              className="group relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition-transform duration-500 hover:-translate-y-1 hover:shadow-md block"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={brand.image}
                alt={brand.label}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Dark gradient overlay for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 w-full p-5 text-center flex flex-col justify-end h-full">
                  <span className="font-sans text-sm font-bold tracking-widest text-white uppercase drop-shadow-md">
                    {brand.label}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 2. Heading moved below the grid */}
      <div className="container mx-auto px-6 text-center mb-10">
        <h2 className="font-serif text-3xl font-semibold text-black">
          Luxury, Reconsidered
        </h2>
        <p className="mt-3 text-gray-500">Legacy pieces, carefully handpicked</p>
      </div>

      {/* 3. Promo Banner */}
      <PromoBannerSection
        title=""
        subtitle=""
        image="https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=1200&q=80"
        imageAlt="Pre-loved luxury collection"
        href="/explore/rare-and-reloved"
        brandLabel="RARE & RELOVED™"
        description="A curated collection of pre-loved luxury"
        imagePosition="left"
        dark
        showDiscover
      />
    </section>
  );
}

export function ForYourVanitySection() {
  return (
    <PromoBannerSection
      title="For Your Vanity"
      subtitle="The finest in makeup, haircare, skincare & fragrances"
      image="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&q=80"
      imageAlt="Beauty and fragrance products"
      href="/explore/beauty"
      brandLabel="BEAUTY & FRAGRANCES"
      description="The finest blends, formulations & notes for every ritual"
      imagePosition="left"
      dark
      showDiscover
    />
  );
}