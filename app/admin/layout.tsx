"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
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
  Menu,
  X,
  Bell,
  Search,
  Crown,
  Loader2
} from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // ✅ Added search state
  const [searchQuery, setSearchQuery] = useState("") 
  // ✅ Added dynamic admin profile state
  const [adminEmail, setAdminEmail] = useState("Admin")

  // 📡 Check authentication status - THIS PROTECTS ALL ADMIN PAGES
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === "admin@orbitluxuries.com") {
        setIsAdmin(true)
        setAdminEmail(user.email) // Store the actual email to use in the UI
      } else {
        setIsAdmin(false)
        // Redirect to login if not authenticated
        router.push("/admin")
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  // 🚪 Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/admin")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  // ✅ Handle Search Submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/admin/products?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  // ⏳ Loading state 
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#c9a84c]/20 border-t-[#c9a84c] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Crown className="w-6 h-6 text-[#c9a84c]" />
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-700 font-medium">Verifying Security Access...</p>
      </div>
    )
  }

  // 🔒 If NOT authenticated - Show login form
  if (!isAdmin) {
    return <>{children}</>
  }

  // ✅ If authenticated - Show full layout with sidebar
  return (
    <div className="admin-page min-h-screen bg-[#f8f9fc]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-[280px] bg-gradient-to-b from-[#1a1a2e] to-[#16213e] border-r border-white/10 shadow-2xl hidden lg:block overflow-y-auto z-50">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#c9a84c] to-[#e8d5a3] rounded-lg flex items-center justify-center">
              <Crown className="w-5 h-5 text-[#1a1a2e]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Orbit</h1>
              <p className="text-[10px] text-[#c9a84c] uppercase tracking-widest font-medium">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          <PremiumNavItem href="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <PremiumNavItem href="/admin/products" icon={Package} label="Products" />
          <PremiumNavItem href="/admin/orders" icon={ShoppingCart} label="Orders" />
          <PremiumNavItem href="/admin/customers" icon={Users} label="Customers" />
          <PremiumNavItem href="/admin/categories" icon={Tag} label="Categories" />
          <PremiumNavItem href="/admin/banners" icon={Image} label="Banners" />
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 border-0 cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-100 px-4 py-3 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 hover:bg-gray-50 rounded-lg border-0 cursor-pointer">
              {isMobileMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#c9a84c] to-[#e8d5a3] rounded-lg flex items-center justify-center">
                <Crown className="w-4 h-4 text-[#1a1a2e]" />
              </div>
              <span className="font-bold text-gray-900">Orbit Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleLogout} className="p-2 hover:bg-gray-50 rounded-lg border-0 cursor-pointer">
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-50 rounded-lg relative border-0 cursor-pointer">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsMobileMenuOpen(false)} />
      )}
      <aside className={`lg:hidden fixed top-0 left-0 h-full w-[280px] bg-gradient-to-b from-[#1a1a2e] to-[#16213e] z-50 transform transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#c9a84c] to-[#e8d5a3] rounded-lg flex items-center justify-center">
              <Crown className="w-5 h-5 text-[#1a1a2e]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Orbit</h1>
              <p className="text-[10px] text-[#c9a84c] uppercase tracking-widest font-medium">Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="p-4 space-y-1">
          <PremiumNavItem href="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <PremiumNavItem href="/admin/products" icon={Package} label="Products" />
          <PremiumNavItem href="/admin/orders" icon={ShoppingCart} label="Orders" />
          <PremiumNavItem href="/admin/customers" icon={Users} label="Customers" />
          <PremiumNavItem href="/admin/categories" icon={Tag} label="Categories" />
          <PremiumNavItem href="/admin/banners" icon={Image} label="Banners" />
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 border-0 cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-[280px] min-h-screen flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 hidden lg:flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, orders, customers..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all"
              />
              <button type="submit" className="hidden" aria-label="Submit Search" />
            </form>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors border-0 cursor-pointer">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="w-9 h-9 bg-gradient-to-br from-[#c9a84c] to-[#e8d5a3] rounded-full flex items-center justify-center text-white font-bold text-sm">
                {/* ✅ Dynamic Initial extracted from email */}
                {adminEmail.charAt(0).toUpperCase()}
              </div>
              <div>
                {/* ✅ Dynamic Email prefix */}
                <p className="text-sm font-medium text-gray-900 capitalize">{adminEmail.split('@')[0]}</p>
                <p className="text-[10px] text-gray-500">Super Admin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content - ✅ FIXED OVERLAP: Added pt-20 for mobile, resets to lg:pt-8 on desktop */}
        <div className="p-4 pt-20 sm:p-6 sm:pt-24 lg:p-8 lg:pt-8 flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}

// Premium Nav Item Component
function PremiumNavItem({ 
  href, 
  icon: Icon, 
  label, 
  badge, 
  active = false 
}: { 
  href: string, 
  icon: any, 
  label: string, 
  badge?: string, 
  active?: boolean 
}) {
  const pathname = usePathname()
  const isActive = pathname === href || active

  return (
    <Link 
      href={href}
      className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        isActive 
          ? 'bg-white/10 text-white shadow-lg shadow-black/10' 
          : 'text-white/60 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon className={`w-5 h-5 ${isActive ? 'text-[#c9a84c]' : 'group-hover:text-[#c9a84c]'}`} />
      <span className="text-sm font-medium flex-1">{label}</span>
      {badge && (
        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium ${
          isActive ? 'bg-[#c9a84c] text-[#1a1a2e]' : 'bg-white/10 text-white/60'
        }`}>
          {badge}
        </span>
      )}
      {isActive && (
        <div className="absolute right-0 w-1 h-8 bg-[#c9a84c] rounded-l-full" />
      )}
    </Link>
  )
}