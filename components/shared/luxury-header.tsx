// components/shared/luxury-header.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Mic, User, ShoppingBag, Heart, Menu, X,Gem } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/context/store-context";
import { MegaMenuContent } from "./mega-menu-content";
import { NavLink, MegaMenuData } from "@/types/index";
import { ShoppingBagDropdown } from "./shopping-bag-dropdown";

const NAV_LINKS: NavLink[] = [
  { label: "New In", href: "/catalog?sort=new" },
  { label: "Men", href: "/catalog?cat=men" },
  { label: "Women", href: "/catalog?cat=women" },
  { label: "Kids", href: "/catalog?cat=kids" },
  { label: "Beauty", href: "/catalog?cat=beauty" },
  { label: "Home", href: "/catalog?cat=home" },
  { label: "Watches", href: "/catalog?cat=watches" },
  // { label: "Indiluxe", href: "/catalog?cat=indiluxe" },
  // { label: "TimeVallée", href: "/explore/timevallee" },
];

interface LuxuryHeaderProps {
  megaMenuData: MegaMenuData;
}

export function LuxuryHeader({ megaMenuData }: LuxuryHeaderProps) {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { cartCount, wishlistCount, user } = useStore();
  
  const bagRef = useRef<HTMLDivElement>(null);
  const bagButtonRef = useRef<HTMLButtonElement>(null);
  
  // ✅ Added: Ref to track the hover timeout
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close bag when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isBagOpen &&
        bagRef.current &&
        !bagRef.current.contains(event.target as Node) &&
        bagButtonRef.current &&
        !bagButtonRef.current.contains(event.target as Node)
      ) {
        setIsBagOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isBagOpen]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  // Close mobile menu when window resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  // Toggle bag
  const toggleBag = () => {
    setIsBagOpen(!isBagOpen);
    if (activeMenu) setActiveMenu(null);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isBagOpen) setIsBagOpen(false);
    if (activeMenu) setActiveMenu(null);
  };

  // Handle Search Submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // ✅ Added: Debounced Hover Handlers
  const handleMouseEnter = (label: string) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setActiveMenu(label);
  };

  const handleMouseLeave = () => {
    // Wait 150ms before closing. If the mouse enters the menu during this time, 
    // the onMouseEnter event will cancel this timeout.
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0a0a0a] text-white border-b border-white/5">
      {/* Top utility row */}
      <div className="flex h-14 items-center justify-between px-4 lg:px-8">
        {/* Mobile Menu Button */}
        <button
          suppressHydrationWarning
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 hover:text-[#c9a84c] transition-colors border-0 bg-transparent cursor-pointer"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Left Side Temporary Logo (Clickable to Home) */}
<Link 
  href="/" 
  className="hidden lg:flex items-center gap-2 text-[#c9a84c] hover:text-[#d4b85c] transition-colors select-none cursor-pointer"
>
  <Gem className="h-5 w-5" />
  <span className="font-serif text-xs tracking-[0.2em] font-bold">THE COLLECTION</span>
</Link>

        {/* Center Logo */}
        <Link href="/" className="flex flex-col items-center leading-none group">
          <span className="text-[8px] font-medium tracking-[0.3em] text-white/40 uppercase">
            ORBIT
          </span>
          <span className="font-serif text-xl lg:text-2xl tracking-wide group-hover:text-[#c9a84c] transition-colors">
            <span className="font-light">ORBIT</span> <span className="font-bold">LUXURIES</span>
          </span>
          <span className="text-[8px] font-light tracking-[0.4em] text-white/30 uppercase mt-0.5 hidden lg:block">
            Premium Luxury
          </span>
        </Link>

        {/* Icons */}
        <div className="flex items-center gap-3 lg:gap-5">
          {/* Auth Button - Hidden on mobile (shown in menu) */}
          <div className="hidden lg:block">
            {!user ? (
              <Link href="/auth/login" className="text-[10px] font-bold tracking-widest uppercase text-white/70 hover:text-[#c9a84c] transition-colors">
                Login / Register
              </Link>
            ) : (
              <Link href="/profile" aria-label="Account" className="hover:text-[#c9a84c] transition-colors">
                <User className="h-[18px] w-[18px]" />
              </Link>
            )}
          </div>

          {/* Wishlist */}
          <Link href="/wishlist" aria-label="Wishlist" className="relative hover:text-[#c9a84c] transition-colors">
            <Heart className="h-[18px] w-[18px]" />
            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#c9a84c] text-[9px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>
          
          {/* Cart / Shopping Bag */}
          <div className="relative" ref={bagRef}>
            <button
              suppressHydrationWarning
              ref={bagButtonRef}
              onClick={toggleBag}
              aria-label="Shopping Bag"
              className="relative hover:text-[#c9a84c] transition-colors border-0 bg-transparent cursor-pointer text-white"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#c9a84c] text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Dropdown */}
            {isBagOpen && (
              <ShoppingBagDropdown onClose={() => setIsBagOpen(false)} />
            )}
          </div>
        </div>
      </div>

      {/* Search row with Form and State */}
      <div className="px-4 pb-4 lg:px-8">
        <form 
          onSubmit={handleSearch}
          className="mx-auto flex max-w-3xl items-center gap-3 border border-white/15 bg-white/5 rounded-full px-4 py-2.5 hover:border-white/30 transition-colors focus-within:border-[#c9a84c]"
        >
          <Search className="h-4 w-4 text-white/40" />
          <input
            suppressHydrationWarning
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What are you looking for?"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
          />
          <button suppressHydrationWarning type="submit" className="hidden" aria-label="Submit Search" />
          <Mic className="h-4 w-4 text-white/40 hover:text-white/70 transition-colors cursor-pointer" />
        </form>
      </div>

      {/* Desktop Nav row */}
      {/* ✅ Use debounced leave and cancel on re-enter */}
      <nav 
        className="relative hidden border-t border-white/5 lg:block"
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => {
          if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        }}
      >
        <ul className="container mx-auto flex items-center justify-center gap-7 px-8 py-2.5">
          {NAV_LINKS.map((link, i) => (
            <li key={link.label} className="flex items-center gap-7">
              {/* ✅ Call debounced hover handler */}
              <span
                className="relative py-2" 
                onMouseEnter={() => handleMouseEnter(link.label)}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "text-[12px] font-medium tracking-wider transition-colors hover:text-[#c9a84c] uppercase",
                    i === 0 && "text-[#c9a84c]",
                    activeMenu === link.label && "text-[#c9a84c]"
                  )}
                >
                  {link.label}
                </Link>
              </span>
              {i === 0 && <span className="h-4 w-px bg-white/10" aria-hidden />}
            </li>
          ))}
          {/* Replace it with this updated trigger: */}
<li className="ml-1 border-l border-white/10 pl-7">
  <span
    className="relative py-2 block cursor-pointer" 
    onMouseEnter={() => handleMouseEnter("Brands")}
  >
    <Link 
      href="/catalog?cat=brands" 
      className={cn(
        "text-[12px] font-semibold tracking-wider uppercase transition-colors hover:text-[#c9a84c]",
        activeMenu === "Brands" && "text-[#c9a84c]"
      )}
    >
      Brands
    </Link>
  </span>
</li>
        </ul>

        {activeMenu && (
          <MegaMenuContent
            navLabel={activeMenu}
            data={megaMenuData}
            onClose={() => setActiveMenu(null)}
          />
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={toggleMobileMenu}
          />
          
          {/* Menu Panel */}
          <div className="fixed left-0 top-0 w-80 max-w-[85vw] h-full bg-[#0a0a0a] z-50 overflow-y-auto p-6 lg:hidden">
            {/* Close button at top */}
            <div className="flex justify-end mb-6">
              <button
                suppressHydrationWarning
                onClick={toggleMobileMenu}
                className="p-2 hover:text-[#c9a84c] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Auth in mobile */}
            <div className="mb-6 mt-4">
              {!user ? (
                <Link
                  href="/auth/login"
                  onClick={toggleMobileMenu}
                  className="block w-full text-center py-3 bg-[#c9a84c] text-black text-sm font-bold uppercase tracking-widest rounded-lg hover:bg-[#d4b85c] transition-colors"
                >
                  Login / Register
                </Link>
              ) : (
                <Link
                  href="/profile"
                  onClick={toggleMobileMenu}
                  className="flex items-center justify-center gap-2 py-3 border border-white/20 text-white text-sm font-bold uppercase tracking-widest rounded-lg hover:bg-white/5 transition-colors"
                >
                  <User className="h-4 w-4" /> My Profile
                </Link>
              )}
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={toggleMobileMenu}
                  className="block py-3 text-sm font-medium tracking-wider uppercase text-white/80 hover:text-[#c9a84c] hover:bg-white/5 px-3 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/catalog?cat=brands"
                onClick={toggleMobileMenu}
                className="block py-3 text-sm font-semibold tracking-wider uppercase text-[#c9a84c] hover:bg-white/5 px-3 rounded-lg transition-colors"
              >
                Brands
              </Link>
            </nav>

            {/* Divider */}
            <div className="border-t border-white/10 my-6" />

            {/* Quick Links */}
            <div className="space-y-1">
              <Link
                href="/wishlist"
                onClick={toggleMobileMenu}
                className="block py-2 text-sm text-white/60 hover:text-[#c9a84c] transition-colors"
              >
                Wishlist
              </Link>
              <Link
                href="/cart"
                onClick={toggleMobileMenu}
                className="block py-2 text-sm text-white/60 hover:text-[#c9a84c] transition-colors"
              >
                Shopping Bag
              </Link>
              <Link
                href="/profile/orders"
                onClick={toggleMobileMenu}
                className="block py-2 text-sm text-white/60 hover:text-[#c9a84c] transition-colors"
              >
                Orders
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}