// components/cards/category-circle.tsx
import Link from "next/link";

interface CategoryItem {
  id: string;
  label: string;
  image: string;
  href: string;
}

export function CategoryCircle({ item }: { item: CategoryItem }) {
  return (
    <Link href={item.href} className="group flex flex-col items-center gap-4">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-100 transition-transform duration-500 group-hover:scale-105 shadow-sm group-hover:shadow-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.label}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      {/* Changed text color to text-black to match reference */}
      <span className="text-[15px] font-semibold text-black transition-colors text-center">
        {item.label}
      </span>
    </Link>
  );
}