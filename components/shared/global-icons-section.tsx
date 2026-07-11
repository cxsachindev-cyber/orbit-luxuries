// components/shared/global-icons-section.tsx
import Link from "next/link";
import { getGlobalIcons } from "@/lib/data/feature-section";
import { useState, useEffect } from "react";

export function GlobalIconsSection() {
  const [icons, setIcons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        const data = await getGlobalIcons();
        setIcons(data);
      } catch (error) {
        console.error("Failed to load global icons:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIcons();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-white flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="font-serif text-3xl font-semibold text-black">Global Icons</h2>
        <p className="mt-3 text-gray-500">
          Impeccable luxury finds that reflect taste &amp; refinement
        </p>
      </div>

      <div className="container mx-auto mt-10 grid grid-cols-1 gap-6 px-6 lg:grid-cols-2">
        {icons.map((icon) => (
          <Link
            key={icon.id}
            href={icon.href}
            className="group relative block aspect-square overflow-hidden bg-gray-100"
          >
            <span className="absolute left-0 top-0 z-10 w-full bg-black py-3 text-center text-sm font-semibold uppercase tracking-widest text-white">
              {icon.brand}
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={icon.image}
              alt={icon.alt}
              className="w-full h-full object-contain p-10 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>
    </section>
  );
}