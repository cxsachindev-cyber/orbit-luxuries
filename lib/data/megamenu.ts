// lib/data/mega-menu.ts
import { MegaMenuData } from "@/types/index";

const MEGA_MENU_DATA: MegaMenuData = {
  Men: {
    columns: [
      {
        heading: "Featured Brands",
        links: [
          { label: "BVLGARI", href: "/brands/bvlgari" },
          { label: "POLO RALPH LAUREN", href: "/brands/polo-ralph-lauren" },
          { label: "GUCCI", href: "/brands/gucci" },
          { label: "ARMANI", href: "/brands/armani" },
          { label: "BOSS", href: "/brands/hugo-boss" },
        ],
      },
      {
        heading: "New In",
        links: [
          { label: "Men", href: "/catalog?cat=men&sort=new" },
          { label: "Women", href: "/catalog?cat=women&sort=new" },
          { label: "Kids", href: "/catalog?cat=kids&sort=new" },
          { label: "Beauty", href: "/catalog?cat=beauty&sort=new" },
          { label: "Home", href: "/catalog?cat=home&sort=new" },
          { label: "Watches", href: "/catalog?cat=watches&sort=new" },
          { label: "Indiluxe", href: "/catalog?cat=indiluxe&sort=new" },
          { label: "TimeVallée", href: "/explore/timevallee" },
          { label: "Brands", href: "/brands" },
        ],
      },
      {
        heading: "Clothing",
        links: [
          { label: "View All", href: "/catalog?cat=men-clothing" },
          { label: "Activewear", href: "/catalog?cat=men-activewear" },
          { label: "Blazers & Coats", href: "/catalog?cat=men-blazers" },
          { label: "T-Shirts", href: "/catalog?cat=men-tshirts" },
          { label: "Innerwear", href: "/catalog?cat=men-innerwear" },
          { label: "Jackets & Coats", href: "/catalog?cat=men-jackets" },
          { label: "Jeans", href: "/catalog?cat=men-jeans" },
          { label: "Polo Shirts", href: "/catalog?cat=men-polo" },
          { label: "Shirts", href: "/catalog?cat=men-shirts" },
          { label: "Trousers", href: "/catalog?cat=men-trousers" },
        ],
      },
      {
        heading: "Bags",
        links: [
          { label: "View All", href: "/catalog?cat=men-bags" },
          { label: "Backpacks", href: "/catalog?cat=men-backpacks" },
          { label: "Crossbody & Messenger", href: "/catalog?cat=men-crossbody" },
          { label: "Duffle Bags", href: "/catalog?cat=men-duffle" },
          { label: "Laptop Bags & Briefcases", href: "/catalog?cat=men-laptop-bags" },
          { label: "Luggage", href: "/catalog?cat=men-luggage" },
          { label: "Cases & Pouches", href: "/catalog?cat=men-cases" },
        ],
      },
      {
        heading: "Accessories",
        links: [
          { label: "View All", href: "/catalog?cat=men-accessories" },
          { label: "Belts", href: "/catalog?cat=men-belts" },
          { label: "Men's Jewellery", href: "/catalog?cat=men-jewellery" },
          { label: "Dufflins", href: "/catalog?cat=men-dufflins" },
          { label: "Eyewear", href: "/catalog?cat=men-eyewear" },
          { label: "Wallets", href: "/catalog?cat=men-wallets" },
          { label: "Scarves", href: "/catalog?cat=men-scarves" },
          { label: "Sunglasses", href: "/catalog?cat=men-sunglasses" },
          { label: "Hats", href: "/catalog?cat=men-hats" },
        ],
      },
      {
        heading: "Shoes",
        links: [
          { label: "View All", href: "/catalog?cat=men-shoes" },
          { label: "Boots", href: "/catalog?cat=men-boots" },
          { label: "Espadrilles", href: "/catalog?cat=men-espadrilles" },
          { label: "Formal Shoes", href: "/catalog?cat=men-formal" },
          { label: "Loafers", href: "/catalog?cat=men-loafers" },
          { label: "Running Shoes", href: "/catalog?cat=men-running" },
          { label: "Sandals", href: "/catalog?cat=men-sandals" },
          { label: "Slides", href: "/catalog?cat=men-slides" },
          { label: "Sneakers", href: "/catalog?cat=men-sneakers" },
          { label: "Trainers", href: "/catalog?cat=men-trainers" },
        ],
      },
    ],
    featuredImage: {
      src: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80",
      alt: "Men's luxury fashion",
      href: "/catalog?cat=men",
      brandLabel: "SABYASACHI",
      description: "Handcrafted jewellery designed for everyday style.",
    },
  },
  Women: {
    columns: [
      {
        heading: "Featured Brands",
        links: [
          { label: "GUCCI", href: "/brands/gucci" },
          { label: "PRADA", href: "/brands/prada" },
          { label: "CHANEL", href: "/brands/chanel" },
          { label: "SAINT LAURENT", href: "/brands/saint-laurent" },
          { label: "VALENTINO", href: "/brands/valentino" },
        ],
      },
      {
        heading: "New In",
        links: [
          { label: "Women", href: "/catalog?cat=women&sort=new" },
          { label: "Men", href: "/catalog?cat=men&sort=new" },
          { label: "Kids", href: "/catalog?cat=kids&sort=new" },
          { label: "Beauty", href: "/catalog?cat=beauty&sort=new" },
          { label: "Home", href: "/catalog?cat=home&sort=new" },
          { label: "Watches & Jewellery", href: "/catalog?cat=watches-jewellery&sort=new" },
          { label: "Indiluxe", href: "/catalog?cat=indiluxe&sort=new" },
          { label: "TimeVallée", href: "/explore/timevallee" },
          { label: "Brands", href: "/brands" },
        ],
      },
      {
        heading: "Clothing",
        links: [
          { label: "View All", href: "/catalog?cat=women-clothing" },
          { label: "Dresses", href: "/catalog?cat=women-dresses" },
          { label: "Tops", href: "/catalog?cat=women-tops" },
          { label: "Skirts", href: "/catalog?cat=women-skirts" },
          { label: "Trousers", href: "/catalog?cat=women-trousers" },
          { label: "Jeans", href: "/catalog?cat=women-jeans" },
          { label: "Co-ords", href: "/catalog?cat=women-coords" },
          { label: "Outerwear", href: "/catalog?cat=women-outerwear" },
          { label: "Lingerie", href: "/catalog?cat=women-lingerie" },
          { label: "Swimwear", href: "/catalog?cat=women-swimwear" },
        ],
      },
      {
        heading: "Bags",
        links: [
          { label: "View All", href: "/catalog?cat=women-bags" },
          { label: "Handbags", href: "/catalog?cat=women-handbags" },
          { label: "Totes", href: "/catalog?cat=women-totes" },
          { label: "Clutches", href: "/catalog?cat=women-clutches" },
          { label: "Crossbody", href: "/catalog?cat=women-crossbody" },
          { label: "Shoulder Bags", href: "/catalog?cat=women-shoulder" },
        ],
      },
      {
        heading: "Accessories",
        links: [
          { label: "View All", href: "/catalog?cat=women-accessories" },
          { label: "Jewellery", href: "/catalog?cat=women-jewellery" },
          { label: "Scarves", href: "/catalog?cat=women-scarves" },
          { label: "Belts", href: "/catalog?cat=women-belts" },
          { label: "Sunglasses", href: "/catalog?cat=women-sunglasses" },
          { label: "Hats", href: "/catalog?cat=women-hats" },
        ],
      },
      {
        heading: "Shoes",
        links: [
          { label: "View All", href: "/catalog?cat=women-shoes" },
          { label: "Heels", href: "/catalog?cat=women-heels" },
          { label: "Flats", href: "/catalog?cat=women-flats" },
          { label: "Boots", href: "/catalog?cat=women-boots" },
          { label: "Sneakers", href: "/catalog?cat=women-sneakers" },
          { label: "Sandals", href: "/catalog?cat=women-sandals" },
          { label: "Loafers", href: "/catalog?cat=women-loafers" },
        ],
      },
    ],
    featuredImage: {
      src: "https://images.unsplash.com/photo-1532453288672-85a43e6a2f0d?w=800&q=80",
      alt: "Women's luxury fashion",
      href: "/catalog?cat=women",
      brandLabel: "CHANEL",
      description: "Couture fashion and timeless elegance for the discerning woman",
    },
  },
  "New In": {
    columns: [
      {
        heading: "New Brands",
        links: [
          { label: "Sabyasachi", href: "/catalog?brand=sabyasachi" },
          { label: "Nike", href: "/catalog?brand=nike" },
          { label: "Roem", href: "/catalog?brand=roem" },
          { label: "Mixxo", href: "/catalog?brand=mixxo" },
          { label: "Aneka", href: "/catalog?brand=aneka" },
          { label: "Sohnaa", href: "/catalog?brand=sohnaa" },
          { label: "Nine West", href: "/catalog?brand=nine-west" },
          { label: "Converse", href: "/catalog?brand=converse" },
          { label: "Laura Mercier", href: "/catalog?brand=laura-mercier" },
          { label: "Maison Margiela", href: "/catalog?brand=maison-margiela" },
          { label: "Asics", href: "/catalog?brand=asics" },
          { label: "Charles & Keith", href: "/catalog?brand=charles-keith" },
          { label: "Guess Jeans", href: "/catalog?brand=guess-jeans" },
        ],
      },
      {
        heading: "New Season Collection",
        links: [
          { label: "Adidas", href: "/catalog?brand=adidas&season=new" },
          { label: "Nike", href: "/catalog?brand=nike&season=new" },
          { label: "Aldo", href: "/catalog?brand=aldo&season=new" },
          { label: "Calvin Klein", href: "/catalog?brand=calvin-klein&season=new" },
          { label: "Gant", href: "/catalog?brand=gant&season=new" },
          { label: "Forever New", href: "/catalog?brand=forever-new&season=new" },
          { label: "Lacoste", href: "/catalog?brand=lacoste&season=new" },
          { label: "Swarovski", href: "/catalog?brand=swarovski&season=new" },
          { label: "Samsonite", href: "/catalog?brand=samsonite&season=new" },
        ],
      },
      {
        heading: "Iconic Collections",
        links: [
          { label: "Rado Captain Cook", href: "/catalog?collection=rado-captain-cook" },
          { label: "Longines Master", href: "/catalog?collection=longines-master" },
          { label: "Tissot PRX", href: "/catalog?collection=tissot-prx" },
          { label: "Seiko Astron", href: "/catalog?collection=seiko-astron" },
          { label: "Baume & Mercier Riviera", href: "/catalog?collection=baume-mercier-riviera" },
          { label: "Oris Aquis", href: "/catalog?collection=oris-aquis" },
          { label: "Movado Bold", href: "/catalog?collection=movado-bold" },
        ],
      },
    ],
    featuredImage: {
      src: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800&q=80",
      alt: "Sabyasachi Jewelry",
      href: "/explore/sabyasachi",
      brandLabel: "SABYASACHI",
      description: "Handcrafted jewellery designed for everyday style.",
    },
  },
  Kids: {
    columns: [
      {
        heading: "Featured Brands",
        links: [
          { label: "GUCCI KIDS", href: "/brands/gucci-kids" },
          { label: "RALPH LAUREN", href: "/brands/polo-ralph-lauren-kids" },
          { label: "BURBERRY", href: "/brands/burberry-kids" },
        ],
      },
      {
        heading: "Boys",
        links: [
          { label: "View All", href: "/catalog?cat=boys" },
          { label: "Clothing", href: "/catalog?cat=boys-clothing" },
          { label: "Footwear", href: "/catalog?cat=boys-footwear" },
          { label: "Accessories", href: "/catalog?cat=boys-accessories" },
        ],
      },
      {
        heading: "Girls",
        links: [
          { label: "View All", href: "/catalog?cat=girls" },
          { label: "Clothing", href: "/catalog?cat=girls-clothing" },
          { label: "Footwear", href: "/catalog?cat=girls-footwear" },
          { label: "Accessories", href: "/catalog?cat=girls-accessories" },
        ],
      },
      {
        heading: "Baby",
        links: [
          { label: "View All", href: "/catalog?cat=baby" },
          { label: "Clothing", href: "/catalog?cat=baby-clothing" },
          { label: "Essentials", href: "/catalog?cat=baby-essentials" },
          { label: "Toys", href: "/catalog?cat=baby-toys" },
        ],
      },
    ],
    featuredImage: {
      src: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&q=80",
      alt: "Kids luxury fashion",
      href: "/catalog?cat=kids",
      brandLabel: "KIDS COLLECTION",
      description: "Miniature luxury for the little ones",
    },
  },
  Beauty: {
    columns: [
      {
        heading: "Featured Brands",
        links: [
          { label: "LA MER", href: "/brands/la-mer" },
          { label: "TOM FORD", href: "/brands/tom-ford" },
          { label: "CHARLOTTE TILBURY", href: "/brands/charlotte-tilbury" },
        ],
      },
      {
        heading: "Makeup",
        links: [
          { label: "View All", href: "/catalog?cat=makeup" },
          { label: "Face", href: "/catalog?cat=makeup-face" },
          { label: "Eyes", href: "/catalog?cat=makeup-eyes" },
          { label: "Lips", href: "/catalog?cat=makeup-lips" },
        ],
      },
      {
        heading: "Skincare",
        links: [
          { label: "View All", href: "/catalog?cat=skincare" },
          { label: "Moisturisers", href: "/catalog?cat=skincare-moisturiser" },
          { label: "Serums", href: "/catalog?cat=skincare-serum" },
          { label: "Cleansers", href: "/catalog?cat=skincare-cleanser" },
          { label: "Masks", href: "/catalog?cat=skincare-mask" },
        ],
      },
      {
        heading: "Fragrance",
        links: [
          { label: "View All", href: "/catalog?cat=fragrance" },
          { label: "Perfumes", href: "/catalog?cat=fragrance-perfume" },
          { label: "Colognes", href: "/catalog?cat=fragrance-cologne" },
          { label: "Gift Sets", href: "/catalog?cat=fragrance-gift" },
        ],
      },
      {
        heading: "Haircare",
        links: [
          { label: "View All", href: "/catalog?cat=haircare" },
          { label: "Shampoo", href: "/catalog?cat=haircare-shampoo" },
          { label: "Conditioner", href: "/catalog?cat=haircare-conditioner" },
          { label: "Treatments", href: "/catalog?cat=haircare-treatment" },
        ],
      },
    ],
    featuredImage: {
      src: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
      alt: "Luxury beauty products",
      href: "/catalog?cat=beauty",
      brandLabel: "TOM FORD",
      description: "The finest blends and formulations for every ritual",
    },
  },
  Home: {
    columns: [
      {
        heading: "Featured Brands",
        links: [
          { label: "FENDI CASA", href: "/brands/fendi-casa" },
          { label: "VERSACE HOME", href: "/brands/versace-home" },
          { label: "RALPH LAUREN HOME", href: "/brands/ralph-lauren-home" },
        ],
      },
      {
        heading: "Living",
        links: [
          { label: "View All", href: "/catalog?cat=home-living" },
          { label: "Decor", href: "/catalog?cat=home-decor" },
          { label: "Cushions", href: "/catalog?cat=home-cushions" },
          { label: "Throws", href: "/catalog?cat=home-throws" },
          { label: "Art", href: "/catalog?cat=home-art" },
        ],
      },
      {
        heading: "Dining",
        links: [
          { label: "View All", href: "/catalog?cat=home-dining" },
          { label: "Tableware", href: "/catalog?cat=home-tableware" },
          { label: "Glassware", href: "/catalog?cat=home-glassware" },
          { label: "Cutlery", href: "/catalog?cat=home-cutlery" },
        ],
      },
      {
        heading: "Kitchen",
        links: [
          { label: "View All", href: "/catalog?cat=home-kitchen" },
          { label: "Cookware", href: "/catalog?cat=home-cookware" },
          { label: "Appliances", href: "/catalog?cat=home-appliances" },
          { label: "Storage", href: "/catalog?cat=home-storage" },
        ],
      },
    ],
    featuredImage: {
      src: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
      alt: "Luxury home decor",
      href: "/catalog?cat=home",
      brandLabel: "FENDI CASA",
      description: "Elevate your living space with luxury furnishings",
    },
  },
"Watches": {
      columns: [
        {
          heading: "Shop by Style",
          links: [
            { label: "Automatic Watches", href: "/catalog?cat=automatic-watches" },
            { label: "Chronograph", href: "/catalog?cat=chronograph" },
            { label: "Dive Watches", href: "/catalog?cat=dive-watches" },
            { label: "Dress Watches", href: "/catalog?cat=dress-watches" },
          ]
        },
        {
          heading: "Featured Brands",
          links: [
            { label: "Rolex", href: "/catalog?brand=rolex" },
            { label: "Omega", href: "/catalog?brand=omega" },
            { label: "Cartier", href: "/catalog?brand=cartier" },
            { label: "Patek Philippe", href: "/catalog?brand=patek" },
          ]
        },
        {
          heading: "Watch Accessories",
          links: [
            { label: "Watch Winders", href: "/catalog?cat=watch-winders" },
            { label: "Leather Straps", href: "/catalog?cat=leather-straps" },
            { label: "Travel Cases", href: "/catalog?cat=watch-cases" },
          ]
        }
      ],
      featuredImage: {
        src: "/images/placeholders/watch-promo.jpg", // Feel free to change this image path!
        alt: "Luxury Timepieces",
        brandLabel: "ROLEX",
        description: "Discover the unparalleled precision of our featured timepieces.",
        href: "/explore/rolex"
      }
    },
  // Indiluxe: {
  //   columns: [
  //     {
  //       heading: "Featured Brands",
  //       links: [
  //         { label: "RAW MANGO", href: "/brands/raw-mango" },
  //         { label: "SABYASACHI", href: "/brands/sabyasachi" },
  //         { label: "MANISH MALHOTRA", href: "/brands/manish-malhotra" },
  //       ],
  //     },
  //     {
  //       heading: "Indiluxe Edit",
  //       links: [
  //         { label: "View All", href: "/catalog?cat=indiluxe" },
  //         { label: "Women", href: "/catalog?cat=indiluxe-women" },
  //         { label: "Men", href: "/catalog?cat=indiluxe-men" },
  //         { label: "Accessories", href: "/catalog?cat=indiluxe-accessories" },
  //         { label: "Jewellery", href: "/catalog?cat=indiluxe-jewellery" },
  //       ],
  //     },
  //   ],
  //   featuredImage: {
  //     src: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800&q=80",
  //     alt: "Indiluxe collection",
  //     href: "/catalog?cat=indiluxe",
  //     brandLabel: "SABYASACHI",
  //     description: "Celebrating Indian craftsmanship and luxury",
  //   },
  // },
  // "TimeVallée": {
  //   columns: [
  //     {
  //       heading: "Maisons",
  //       links: [
  //         { label: "Cartier", href: "/brands/cartier" },
  //         { label: "IWC Schaffhausen", href: "/brands/iwc" },
  //         { label: "Jaeger-LeCoultre", href: "/brands/jaeger-lecoultre" },
  //         { label: "Panerai", href: "/brands/panerai" },
  //         { label: "Piaget", href: "/brands/piaget" },
  //         { label: "Roger Dubuis", href: "/brands/roger-dubuis" },
  //       ],
  //     },
  //   ],
  //   featuredImage: {
  //     src: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80",
  //     alt: "Luxury watches",
  //     href: "/explore/timevallee",
  //     brandLabel: "TIMEVALLÉE",
  //     description: "A unique destination for all watch lovers",
  //   },
  // },
  // 🎯 UPDATED BRANDS DROPDOWN WITH RICH LAYOUT
  Brands: {
    columns: [
      {
        heading: "Featured Brands",
        links: [
          { label: "SABYASACHI", href: "/brands/sabyasachi" },
          { label: "ALDO", href: "/brands/aldo" },
          { label: "GUESS", href: "/brands/guess" },
          { label: "LACOSTE", href: "/brands/lacoste" },
          { label: "LE CREUSET", href: "/brands/le-creuset" },
          { label: "3DMLifestyle", href: "/brands/3dmlifestyle" },
          { label: "4711", href: "/brands/4711" },
          { label: "Onitsuka Tiger", href: "/brands/onitsuka-tiger" },
          { label: "RALPH LAUREN", href: "/brands/ralph-lauren" },
          { label: "POLO", href: "/brands/polo" },
          { label: "RITU KUMAR", href: "/brands/ritu-kumar" },
          { label: "SEIKO", href: "/brands/seiko" },
          { label: "SWAROVSKI", href: "/brands/swarovski" },
          { label: "TISSOT", href: "/brands/tissot" },
        ],
      },
      {
        heading: "Exclusive Brands",
        links: [
          { label: "TOM FORD", href: "/brands/tom-ford" },
          { label: "CHARLES & KEITH", href: "/brands/charles-keith" },
          { label: "Samsonite", href: "/brands/samsonite" },
          { label: "PRADA", href: "/brands/prada" },
          { label: "ESTEE LAUDER", href: "/brands/estee-lauder" },
          { label: "DOLCE & GABBANA", href: "/brands/dolce-gabbana" },
          { label: "Adidas", href: "/brands/adidas" },
          { label: "Adidas Originals", href: "/brands/adidas-originals" },
          { label: "ADYA", href: "/brands/adya" },
          { label: "AeroPress", href: "/brands/aeropress" },
          { label: "AFBA", href: "/brands/afba" },
        ],
      },
      {
        heading: "Popular Brands",
        links: [
          { label: "Abraham & Thakore", href: "/brands/abraham-thakore" },
          { label: "AddressHome", href: "/brands/addresshome" },
          { label: "Michael Kors", href: "/brands/michael-kors" },
          { label: "Hugo Boss", href: "/brands/hugo-boss" },
          { label: "Coach", href: "/brands/coach" },
          { label: "Nike", href: "/brands/nike" },
          { label: "Puma", href: "/brands/puma" },
          { label: "Calvin Klein", href: "/brands/calvin-klein" },
          { label: "Gant", href: "/brands/gant" },
          { label: "Forever New", href: "/brands/forever-new" },
          { label: "Nine West", href: "/brands/nine-west" },
          { label: "Converse", href: "/brands/converse" },
          { label: "Asics", href: "/brands/asics" },
          { label: "Maison Margiela", href: "/brands/maison-margiela" },
        ],
      },
    ],
    featuredImage: {
      src: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
      alt: "Luxury brands",
      href: "/brands",
      brandLabel: "LUXURY BRANDS",
      description: "Discover the world's finest luxury labels",
    },
  },
};

export async function getMegaMenuData(): Promise<MegaMenuData> {
  return MEGA_MENU_DATA;
}