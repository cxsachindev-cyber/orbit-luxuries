"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Tag, 
  Image, 
  BarChart3, 
  Settings,
  LogOut,
  Crown,
  TrendingUp,
  Wallet,
  Box,
  Truck,
  ArrowLeft,
  Layers,
  ClipboardList
} from "lucide-react"

export default function AdminSidebar() {
  const pathname = usePathname()

  // Premium navigation links with icons and badges
  const navLinks = [
    { 
      label: "Dashboard", 
      href: "/admin", 
      icon: LayoutDashboard,
      badge: "Live"
    },
    { 
      label: "Products", 
      href: "/admin/products", 
      icon: Package,
      badge: "342"
    },
    { 
      label: "Orders", 
      href: "/admin/orders", 
      icon: ShoppingCart,
      badge: "12",
      badgeColor: "gold"
    },
    { 
      label: "Customers", 
      href: "/admin/customers", 
      icon: Users,
      badge: "+2.4k"
    },
    { 
      label: "Categories", 
      href: "/admin/categories", 
      icon: Layers
    },
    { 
      label: "Brands", 
      href: "/admin/brands", 
      icon: Tag
    },
    { 
      label: "Banners", 
      href: "/admin/banners", 
      icon: Image
    },
    { 
      label: "Analytics", 
      href: "/admin/analytics", 
      icon: BarChart3
    },
  ]

  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] bg-gradient-to-b from-[#1a1a2e] to-[#16213e] border-r border-white/10 shadow-2xl flex flex-col justify-between overflow-y-auto z-50">
      
      {/* 🏆 BRAND HEADER WITH GOLD ACCENT */}
      <div>
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#c9a84c] to-[#e8d5a3] rounded-2xl flex items-center justify-center shadow-lg shadow-[#c9a84c]/20">
              <Crown className="w-6 h-6 text-[#1a1a2e]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Orbit</h1>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#c9a84c] uppercase tracking-[0.2em] font-medium">Admin Panel</span>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              </div>
            </div>
          </div>
        </div>

        {/* 🔍 QUICK SEARCH */}
        <div className="px-4 py-4 border-b border-white/5">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* 📋 NAVIGATION LINKS */}
        <nav className="p-4 space-y-1">
          <div className="px-3 py-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">Main Menu</p>
          </div>
          
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href || (link.href !== "/admin" && pathname?.startsWith(link.href))
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-white/10 text-white shadow-lg shadow-black/10' 
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-[#c9a84c]' : 'group-hover:text-[#c9a84c]'
                }`} />
                
                <span className="text-sm font-medium flex-1">{link.label}</span>
                
                {link.badge && (
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    link.badgeColor === 'gold' 
                      ? 'bg-[#c9a84c] text-[#1a1a2e]' 
                      : isActive 
                        ? 'bg-[#c9a84c] text-[#1a1a2e]' 
                        : 'bg-white/10 text-white/60'
                  }`}>
                    {link.badge}
                  </span>
                )}

                {isActive && (
                  <>
                    <div className="absolute right-0 w-1 h-8 bg-[#c9a84c] rounded-l-full"></div>
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#c9a84c] to-[#e8d5a3] rounded-r-full"></div>
                  </>
                )}
              </Link>
            )
          })}

          {/* Divider with Settings */}
          <div className="my-4 px-3">
            <div className="border-t border-white/5"></div>
          </div>

          <Link
            href="/admin/settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              pathname === '/admin/settings'
                ? 'bg-white/10 text-white shadow-lg shadow-black/10' 
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className={`w-5 h-5 transition-colors ${
              pathname === '/admin/settings' ? 'text-[#c9a84c]' : 'group-hover:text-[#c9a84c]'
            }`} />
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </nav>
      </div>

      {/* 👤 BOTTOM SECTION - USER & STOREFRONT */}
      <div className="p-4 border-t border-white/10">
        {/* User Profile */}
        <div className="flex items-center gap-3 px-4 py-3 mb-3 bg-white/5 rounded-xl">
          <div className="w-10 h-10 bg-gradient-to-br from-[#c9a84c] to-[#e8d5a3] rounded-full flex items-center justify-center text-[#1a1a2e] font-bold text-sm">
            A
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Administrator</p>
            <p className="text-[10px] text-white/40">Super Admin</p>
          </div>
          <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <LogOut className="w-4 h-4 text-white/40 hover:text-white" />
          </button>
        </div>

        {/* Storefront Link */}
        <Link 
          href="/" 
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-200 text-white/60 hover:text-white group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-medium uppercase tracking-wider">Return to Storefront</span>
        </Link>
      </div>
    </aside>
  )
}