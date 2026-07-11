// lib/data/products.ts
export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  description: string;
  category: string;
  image: string;
  images: string[];
  sizes: string[];
  specs: string[];
}

export const products: Product[] = [
  {
    id: "1",
    name: "Luxury Silk Evening Gown",
    brand: "Chanel",
    price: 2999,
    originalPrice: 4500,
    description: "Elegant silk evening gown with intricate embroidery",
    category: "Dresses",
    // ✅ Replaced local paths with live Unsplash URLs
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80", 
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80", 
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80"
    ],
    sizes: ["S", "M", "L", "XL"],
    specs: ["100% Silk", "Dry clean only", "Made in Italy", "Length: 55 inches"]
  },
  // Add more products here
];