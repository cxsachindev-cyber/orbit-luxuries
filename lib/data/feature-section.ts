// lib/data/feature-sections.ts

export interface IconItem {
  id: string;
  brand: string;
  image: string;
  href: string;
  alt: string;
}

export interface BrandStripItem {
  id: string;
  label: string;
  image?: string;
  href: string;
}

export interface BvlgariLine {
  id: string;
  label: string;
  image: string;
  href: string;
}

// Global Icons
const globalIcons: IconItem[] = [
  {
    id: "darveys",
    brand: "DARVEYS",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80",
    href: "/brands/darveys",
    alt: "Darveys luxury brand"
  },
  {
    id: "coach",
    brand: "COACH",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80",
    href: "/brands/coach",
    alt: "Coach leather backpack"
  }
];

// Bvlgari Lines
const bvlgariLines: BvlgariLine[] = [
  {
    id: "serpenti",
    label: "Serpenti",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80",
    href: "/explore/bvlgari/serpenti"
  },
  {
    id: "bzero1",
    label: "B.zero1",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80",
    href: "/explore/bvlgari/bzero1"
  },
  {
    id: "octo",
    label: "Octo",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&q=80",
    href: "/explore/bvlgari/octo"
  },
  {
    id: "bvlgari",
    label: "Bvlgari",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80",
    href: "/brands/bvlgari"
  }
];

// Watch Maison Strip (for Luxury Legends)
const watchMaisons: BrandStripItem[] = [
  { id: "cartier", label: "Cartier", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=200&q=80", href: "/brands/cartier" },
  { id: "iwc", label: "IWC Schaffhausen", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=200&q=80", href: "/brands/iwc" },
  { id: "jaeger", label: "Jaeger-LeCoultre", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=200&q=80", href: "/brands/jaeger-lecoultre" },
  { id: "panerai", label: "Panerai", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=200&q=80", href: "/brands/panerai" },
  { id: "piaget", label: "Piaget", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=200&q=80", href: "/brands/piaget" },
  { id: "roger", label: "Roger Dubuis", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=200&q=80", href: "/brands/roger-dubuis" }
];

// Fashion Brand Strip (for Spotlight On)
const fashionBrands: BrandStripItem[] = [
  { id: "michael-kors", label: "Michael Kors", href: "/brands/michael-kors" },
  { id: "hugo-boss", label: "Hugo Boss", href: "/brands/hugo-boss" },
  { id: "emporio-armani", label: "Emporio Armani", href: "/brands/emporio-armani" },
  { id: "saint-laurent", label: "Saint Laurent", href: "/brands/saint-laurent" },
  { id: "jacquemus", label: "Jacquemus", href: "/brands/jacquemus" },
  { id: "coach", label: "Coach", href: "/brands/coach" }
];

// Apparel Brand Strip (for Luxury Reconsidered)
const apparelBrands: BrandStripItem[] = [
  { id: "polo", label: "Polo Ralph Lauren", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=200&q=80", href: "/brands/polo-ralph-lauren" },
  { id: "fred-perry", label: "Fred Perry", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=200&q=80", href: "/brands/fred-perry" },
  { id: "ted-baker", label: "Ted Baker", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=200&q=80", href: "/brands/ted-baker" },
  { id: "hackett", label: "Hackett London", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=200&q=80", href: "/brands/hackett-london" },
  { id: "karl", label: "Karl Lagerfeld", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=200&q=80", href: "/brands/karl-lagerfeld" },
  { id: "versace", label: "Versace Jeans Couture", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=200&q=80", href: "/brands/versace-jeans-couture" }
];

export async function getGlobalIcons(): Promise<IconItem[]> {
  return globalIcons;
}

export async function getBvlgariLines(): Promise<BvlgariLine[]> {
  return bvlgariLines;
}

export async function getWatchMaisonStrip(): Promise<BrandStripItem[]> {
  return watchMaisons;
}

export async function getFashionBrandStrip(): Promise<BrandStripItem[]> {
  return fashionBrands;
}

export async function getApparelBrandStrip(): Promise<BrandStripItem[]> {
  return apparelBrands;
}