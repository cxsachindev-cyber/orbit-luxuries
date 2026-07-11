// lib/data/dummy-images.ts

// Placeholder images for products
export const dummyImages = {
  // Hero Images
  hero: {
    main: "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=1200&q=80",
    fashion: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80",
    watches: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200&q=80",
    beauty: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80",
  },
  
  // Category Images
  categories: {
    watches: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80",
    menswear: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80",
    womenswear: "https://images.unsplash.com/photo-1532453288672-85a43e6a2f0d?w=400&q=80",
    footwear: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80",
    handbags: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80",
    accessories: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&q=80",
    eyewear: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&q=80",
    beauty: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80",
    jewellery: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80",
    kids: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400&q=80",
    home: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=80",
    indiluxe: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=400&q=80",
  },
  
  // Brand Logos
  brands: {
    "Michael Kors": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&q=80",
    "Guess": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&q=80",
    "Adidas": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&q=80",
    "Darveys": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&q=80",
    "Swarovski": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&q=80",
    "Rayban": "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=200&q=80",
    "Montblanc": "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=200&q=80",
    "Lacoste": "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=200&q=80",
    "Maserati": "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=200&q=80",
    "Coach": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&q=80",
  },
  
  // Product Images
  products: {
    luxuryBag: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80",
    luxuryWatch: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80",
    luxuryShoes: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80",
    luxuryPerfume: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80",
    luxuryJewellery: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
    luxurySunglasses: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80",
    luxuryClothing: "https://images.unsplash.com/photo-1532453288672-85a43e6a2f0d?w=600&q=80",
    luxuryHome: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80",
  }
};

// Product data with dummy images
export const dummyProducts = [
  {
    id: "1",
    name: "Classic Leather Tote",
    brand: "Michael Kors",
    price: 24999,
    originalPrice: 35000,
    description: "Elegant leather tote bag perfect for everyday luxury",
    category: "Handbags",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80&h=800&fit=crop",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80&h=800&fit=crop&crop=center",
    ],
    sizes: ["S", "M", "L"],
    specs: ["100% Genuine Leather", "Gold-tone Hardware", "Made in Italy"],
  },
  {
    id: "2",
    name: "Luxury Chronograph Watch",
    brand: "Maserati",
    price: 45999,
    originalPrice: 65000,
    description: "Precision chronograph with Italian design",
    category: "Watches",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80&h=800&fit=crop",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80&h=800&fit=crop&crop=center",
    ],
    sizes: ["38mm", "40mm", "42mm"],
    specs: ["Swiss Movement", "Sapphire Crystal", "Water Resistant"],
  },
  {
    id: "3",
    name: "Premium Leather Sneakers",
    brand: "Adidas",
    price: 18999,
    originalPrice: 25000,
    description: "Premium leather sneakers with iconic design",
    category: "Footwear",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80&h=800&fit=crop",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80&h=800&fit=crop&crop=center",
    ],
    sizes: ["7", "8", "9", "10", "11"],
    specs: ["Premium Leather", "Rubber Sole", "Made in Germany"],
  },
  {
    id: "4",
    name: "Designer Silk Scarf",
    brand: "Guess",
    price: 7999,
    originalPrice: 12000,
    description: "Luxurious silk scarf with signature print",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80&h=800&fit=crop",
    ],
    sizes: ["One Size"],
    specs: ["100% Silk", "Made in France"],
  },
  {
    id: "5",
    name: "Crystal Pendant Necklace",
    brand: "Swarovski",
    price: 15999,
    originalPrice: 22000,
    description: "Stunning crystal pendant with chain",
    category: "Jewellery",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80&h=800&fit=crop",
    ],
    sizes: ["16 inch", "18 inch"],
    specs: ["Swarovski Crystal", "Sterling Silver", "Hypoallergenic"],
  },
  {
    id: "6",
    name: "Aviator Sunglasses",
    brand: "Rayban",
    price: 12999,
    originalPrice: 18000,
    description: "Classic aviator sunglasses with gold frame",
    category: "Eyewear",
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80",
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80&h=800&fit=crop",
    ],
    sizes: ["Small", "Medium", "Large"],
    specs: ["Polarized Lenses", "Gold Frame", "UV Protection"],
  },
];

// Brand data with dummy images
export const dummyBrands = [
  { id: "michael-kors", name: "Michael Kors", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80" },
  { id: "guess", name: "Guess", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80" },
  { id: "adidas", name: "Adidas", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80" },
  { id: "darveys", name: "Darveys", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80" },
  { id: "swarovski", name: "Swarovski", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80" },
  { id: "rayban", name: "Rayban", image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&q=80" },
  { id: "montblanc", name: "Montblanc", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&q=80" },
  { id: "lacoste", name: "Lacoste", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80" },
  { id: "maserati", name: "Maserati", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80" },
  { id: "coach", name: "Coach", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80" },
];