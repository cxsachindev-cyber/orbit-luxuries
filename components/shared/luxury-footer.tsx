// components/shared/luxury-footer.tsx
import Link from "next/link";
import { Shield } from "lucide-react";
import { FooterColumnData } from "@/lib/data/footer";

function FooterColumn({ heading, links }: FooterColumnData) {
  return (
    <div>
      <h4 className="mb-5 font-serif text-lg font-semibold text-white">{heading}</h4>
      <ul className="space-y-3">
        {links.map((label) => (
          <li key={label}>
            <Link
              href={`/catalog?q=${encodeURIComponent(label)}`}
              className="text-sm text-gray-400 transition-colors hover:text-luxe-gold"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface LuxuryFooterProps {
  columns: FooterColumnData[];
}

export function LuxuryFooter({ columns }: LuxuryFooterProps) {
  return (
    <footer className="bg-luxe-black px-6 py-16 text-white lg:px-10 border-t border-white/10">
      <div className="container mx-auto grid grid-cols-2 gap-10 lg:grid-cols-4">
        {columns.map((col) => (
          <FooterColumn key={col.heading} heading={col.heading} links={col.links} />
        ))}
      </div>

      <div className="container mx-auto mt-16 border-t border-white/10 pt-10">
        <h3 className="font-serif text-2xl font-semibold text-white">
          Savour The Best: Orbit Luxuries
        </h3>
        <p className="mt-4 max-w-4xl text-sm leading-relaxed text-gray-400">
          Redefining the term luxury in India — one that reflects the flawless
          values of thoughtfulness, authenticity, timeliness, and quality. Orbit
          Luxuries embraces the principles of the experiential commerce brand
          philosophy to enhance consumers&apos; online luxury shopping experience.
          Here, the attention shifts to finer details, craftsmanship, heritage,
          and the tranquillity and value of an experience, where browsing is a
          delight and quality is nurtured.
        </p>
      </div>

      <div className="container mx-auto mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-gray-500 sm:flex-row">
        <span>© {new Date().getFullYear()} Orbit Luxuries. All rights reserved.</span>
        <div className="flex items-center gap-6">
          <Link
            href="/admin/login"
            className="flex items-center gap-1.5 text-gray-500 hover:text-[#c9a84c] transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            Admin Login
          </Link>
          <span>A Premium Luxury Destination</span>
        </div>
      </div>
    </footer>
  );
}