// components/shared/brand-logo-strip.tsx
import Link from "next/link";

interface BrandStripItem {
  id: string;
  label: string;
  image?: string;
  href: string;
}

interface BrandLogoStripProps {
  items: BrandStripItem[];
  variant?: "image" | "text";
}

export function BrandLogoStrip({ items, variant = "image" }: BrandLogoStripProps) {
  if (variant === "text") {
    return (
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className="group flex flex-col items-center gap-3"
        >
          {item.image && (
            <div className="relative aspect-square w-full max-w-[120px] rounded-full overflow-hidden bg-gray-100 border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.label}
                className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}
          <span className="text-xs font-medium text-gray-500 group-hover:text-black transition-colors text-center">
            {item.label}
          </span>
        </Link>
      ))}
    </div>
  );
}