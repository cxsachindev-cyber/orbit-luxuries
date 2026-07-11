// lib/data/categories.ts

export interface CategoryItem {
  id: string;
  label: string;
  image: string;
  href: string;
}

const categories: CategoryItem[] = [
  {
    id: "watches",
    label: "Watches",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80",
    href: "/catalog?cat=watches"
  },
  {
    id: "menswear",
    label: "Menswear",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80",
    href: "/catalog?cat=men"
  },
  {
    id: "womenswear",
    label: "Womenswear",
    image: "https://images.unsplash.com/photo-1532453288672-85a43e6a2f0d?w=400&q=80",
    href: "/catalog?cat=women"
  },
  {
    id: "footwear",
    label: "Footwear",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80",
    href: "/catalog?cat=footwear"
  },
  {
    id: "handbags",
    label: "Handbags",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80",
    href: "/catalog?cat=handbags"
  },
  {
    id: "accessories",
    label: "Men's Accessories",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&q=80",
    href: "/catalog?cat=accessories"
  },
  {
    id: "eyewear",
    label: "Eyewear",
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&q=80",
    href: "/catalog?cat=eyewear"
  },
  {
    id: "beauty",
    label: "Beauty & Fragrances",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80",
    href: "/catalog?cat=beauty"
  },
  {
    id: "jewellery",
    label: "Jewellery",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80",
    href: "/catalog?cat=jewellery"
  },
  {
    id: "kids",
    label: "Kids",
    image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400&q=80",
    href: "/catalog?cat=kids"
  },
  {
    id: "home",
    label: "Home",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=80",
    href: "/catalog?cat=home"
  },
  {
    id: "indiluxe",
    label: "Indiluxe",
    image: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=400&q=80",
    href: "/catalog?cat=indiluxe"
  }
];

export async function getCategories(): Promise<CategoryItem[]> {
  return categories;
}