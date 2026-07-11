// lib/data/brands.ts

export interface BrandOffer {
  id: string;
  brand: string;
  image: string;
  offerLabel: string;
  href: string;
  tag?: string;
  size?: "lg" | "md" | "sm";
}

const topBrands: BrandOffer[] = [
  {
    id: "darveys",
    brand: "DARVEYS",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80",
    offerLabel: "UP TO 40% OFF",
    href: "/brands/darveys",
    tag: "EXCLUSIVE",
    size: "lg"
  },
  {
    id: "michael-kors",
    brand: "MICHAEL KORS",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80",
    offerLabel: "UP TO 40% OFF",
    href: "/brands/michael-kors",
    tag: "SPECIAL OFFERS",
    size: "lg"
  },
  {
    id: "guess",
    brand: "GUESS JEANS",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80",
    offerLabel: "UP TO 50% OFF",
    href: "/brands/guess",
    tag: "SPECIAL OFFERS",
    size: "lg"
  }
];

const moreBrands: BrandOffer[] = [
  {
    id: "swarovski",
    brand: "SWAROVSKI",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80",
    offerLabel: "UP TO 40% OFF",
    href: "/brands/swarovski",
    tag: "BESTSELLERS"
  },
  {
    id: "da-milano",
    brand: "DA MILANO",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80",
    offerLabel: "EXTRA OFFERS",
    href: "/brands/da-milano",
    tag: "EXPLORE"
  },
  {
    id: "rayban",
    brand: "RAYBAN",
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&q=80",
    offerLabel: "UP TO 40% OFF",
    href: "/brands/rayban",
    tag: "BESTSELLERS"
  },
  {
    id: "montblanc",
    brand: "MONTBLANC",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&q=80",
    offerLabel: "UP TO 50% OFF",
    href: "/brands/montblanc",
    tag: "EXPLORE"
  },
  {
    id: "wellness-home",
    brand: "WELLNESSAT HOME",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=80",
    offerLabel: "UP TO 40% OFF",
    href: "/brands/wellness-home",
    tag: "SPECIAL OFFERS"
  },
  {
    id: "gant",
    brand: "GANT",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80",
    offerLabel: "UP TO 40% OFF",
    href: "/brands/gant",
    tag: "EXPLORE"
  },
  {
    id: "elca",
    brand: "ELCA",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80",
    offerLabel: "UP TO 40% OFF",
    href: "/brands/elca",
    tag: "BESTSELLERS"
  },
  {
    id: "marc-jacobs",
    brand: "MARC JACOBS",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80",
    offerLabel: "FLAT 10% OFF ON",
    href: "/brands/marc-jacobs",
    tag: "SPECIAL OFFERS"
  },
  {
    id: "lacoste",
    brand: "LACOSTE",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80",
    offerLabel: "UPTO 12% OFF",
    href: "/brands/lacoste",
    tag: "EXPLORE"
  },
  {
    id: "maserati",
    brand: "MASERATI",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80",
    offerLabel: "EXTRA OFFERS",
    href: "/brands/maserati",
    tag: "UPTO 40% OFF"
  },
  {
    id: "onitsuka-tiger",
    brand: "ONITSUKATIGER",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80",
    offerLabel: "BESTSELLERS",
    href: "/brands/onitsuka-tiger",
    tag: "EXPLORE"
  },
  {
    id: "tory-burch",
    brand: "TORYBURCH",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80",
    offerLabel: "UPTO 40% OFF",
    href: "/brands/tory-burch",
    tag: "BESTSELLERS"
  }
];

export async function getTopBrands(): Promise<BrandOffer[]> {
  return topBrands;
}

export async function getMoreBrands(): Promise<BrandOffer[]> {
  return moreBrands;
}