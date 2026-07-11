/**
 * STATIC DATA SOURCE (current). Collection suggestion: "footerLinks",
 * one doc per column keyed by column id, each with a `links: string[]`
 * field. See lib/data/categories.ts for the swap pattern.
 */

export interface FooterColumnData {
  heading: string;
  links: string[];
}

const FOOTER_COLUMNS: FooterColumnData[] = [
  {
    heading: "Shop Luxury",
    links: ["Men", "Women", "Handbags", "Watches", "Home", "Shoes", "Fragrances", "Kids", "Beauty"],
  },
  {
    heading: "Shop Indiluxe",
    links: ["Women", "Men", "Accessories", "Jewellery", "Home"],
  },
  {
    heading: "Popular Searches",
    links: ["Lacoste", "Michael Kors", "Coach", "Diesel", "Watches", "Armani Exchange", "Polo Tshirts", "Wallets"],
  },
  {
    heading: "Useful Links",
    links: [
      "Contact Us",
      "FAQ",
      "Shipping",
      "Cancellation",
      "Returns FAQs",
      "Return Policy",
      "Replacement Policy",
      "Privacy Policy",
      "Terms & Conditions",
      "Gift Card T&C",
    ],
  },
];

export async function getFooterColumns(): Promise<FooterColumnData[]> {
  return FOOTER_COLUMNS;
}
