// lib/data/hero.ts

export interface HeroSlide {
  id: string;
  image: string;
  href: string;
  alt: string;
  title?: string;
  subtitle?: string;
  cta?: string;
}

export interface SideAd {
  id: string;
  image: string;
  href: string;
  alt: string;
  title?: string;
  subtitle?: string;
  cta?: string;
}

// Hero slides data
const heroSlides: HeroSlide[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=1600&q=80",
    href: "/catalog",
    alt: "Luxury Fashion Collection",
    title: "Discover Luxury",
    subtitle: "Explore our curated collection of premium fashion",
    cta: "Shop Now",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&q=80",
    href: "/catalog?cat=watches-jewellery",
    alt: "Luxury Watches Collection",
    title: "Timeless Elegance",
    subtitle: "Discover the finest timepieces from around the world",
    cta: "Explore Watches",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1600&q=80",
    href: "/catalog?cat=beauty",
    alt: "Luxury Beauty Collection",
    title: "The Art of Beauty",
    subtitle: "Premium skincare, makeup, and fragrances",
    cta: "Shop Beauty",
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
    href: "/catalog?cat=women",
    alt: "Women's Luxury Fashion",
    title: "Women's Collection",
    subtitle: "Couture fashion for the modern woman",
    cta: "Explore Women",
  },
];

// Side ad data
const sideAd: SideAd = {
  id: "side-1",
  image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
  href: "/catalog?brand=michael-kors",
  alt: "Michael Kors Collection",
  title: "MICHAEL KORS",
  subtitle: "New Collection Arriving",
  cta: "Discover",
};

export async function getHeroSlides(): Promise<HeroSlide[]> {
  return heroSlides;
}

export async function getHeroSideAd(): Promise<SideAd | null> {
  return sideAd;
}