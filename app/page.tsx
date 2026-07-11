// app/page.tsx
"use client";

import { HeroCarousel } from "@/components/shared/hero-carousel";
import { PopularCategoriesSection } from "@/components/shared/popular-categories-section";
import { TopBrandsSection } from "@/components/shared/top-brands-section";
import { GlobalIconsSection } from "@/components/shared/global-icons-section";
import {
  BvlgariFocusSection,
  LuxuryLegendsSection,
  SpotlightOnSection,
  LuxuryReconsideredSection,
  ForYourVanitySection,
} from "@/components/shared/homepage-feature-section";

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <PopularCategoriesSection />
      <TopBrandsSection />
      <GlobalIconsSection />
      <BvlgariFocusSection />
      <LuxuryLegendsSection />
      <SpotlightOnSection />
      <LuxuryReconsideredSection />
      <ForYourVanitySection />
    </>
  );
}