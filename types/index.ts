// types/index.ts
export interface NavLink {
  label: string;
  href: string;
}

export interface HeroSlide {
  id: string;
  image: string;
  href: string;
  alt: string;
}

export interface FeaturedImage {
  src: string;
  alt: string;
  href: string;
  brandLabel?: string;
  description?: string;
}

export interface CategoryItem {
  id: string;
  label: string;
  image: string;
  href: string;
}

export interface BrandOffer {
  id: string;
  brand: string;
  image: string;
  offerLabel: string;
  href: string;
  tag?: string;
  size?: "lg" | "md" | "sm";
}

export interface PromoSection {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle: string;
  href: string;
}

export interface MegaMenuColumn {
  heading: string;
  links: NavLink[];
}

// 🎯 FIXED: Use FeaturedImage interface instead of inline type
export interface MegaMenuData {
  [navLabel: string]: {
    columns: MegaMenuColumn[];
    featuredImage?: FeaturedImage; // ← Changed to use FeaturedImage interface
    isBrandsMenu?: boolean;
  };
}
