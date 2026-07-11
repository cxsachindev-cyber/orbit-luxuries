import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PromoBannerProps {
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  href: string;
  brandLabel?: string;
  description?: string;
  imagePosition?: "left" | "right" | "center";
  dark?: boolean;
  showDiscover?: boolean;
}

export function PromoBannerSection({
  title,
  subtitle,
  image,
  imageAlt,
  href,
  brandLabel,
  description,
  imagePosition = "right",
  dark = false,
  showDiscover = true,
}: PromoBannerProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="font-serif text-3xl font-semibold text-black">{title}</h2>
        <p className="mt-3 text-gray-500">{subtitle}</p>
      </div>

      <div
        className={`relative mt-10 flex min-h-[420px] items-center overflow-hidden ${
          dark ? "text-white" : "text-black"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={imageAlt}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {dark && <div className="absolute inset-0 bg-black/35" />}

        <div
          className={`relative z-10 w-full px-10 lg:px-20 ${
            imagePosition === "left"
              ? "flex justify-end text-right"
              : imagePosition === "center"
              ? "flex justify-center text-center"
              : "flex justify-start text-left"
          }`}
        >
          <div className="max-w-sm space-y-4">
            {brandLabel && (
              <p className="font-serif text-2xl tracking-wide">{brandLabel}</p>
            )}
            {description && <p className="text-sm leading-relaxed">{description}</p>}
            {showDiscover && (
              <Button asChild variant="outline" className="border-current hover:bg-[#c9a84c] hover:text-white hover:border-[#c9a84c] transition-colors">
                <Link href={href}>DISCOVER</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}