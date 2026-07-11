"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import { 
  Lock, 
  Mail, 
  Loader2, 
  Crown,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck
} from "lucide-react"

export default function AdminPortalPage() {
  const router = useRouter()

  // 🔒 AUTHENTICATION STATES
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  // 📡 Keep account loops verified on window mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.email === "admin@orbitluxuries.com") {
        setIsAdmin(true)
        // ✅ SECURE AUTO-FORWARD: If already logged in, skip the form and route to the dashboard!
        router.push("/admin/dashboard")
      } else {
        setIsAdmin(false)
      }
    })
    return () => unsubscribe()
  }, [router])

  // 🔑 Secure Gateway Authentication Handler
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")
    setAuthLoading(true)

    try {
      if (email.trim() !== "admin@orbitluxuries.com") {
        throw new Error("Access denied. Unauthorized admin terminal node.")
      }
      
      await signInWithEmailAndPassword(auth, email.trim(), password)
      setIsAdmin(true)
      
      // ✅ SUCCESS ROUTE: Send them straight to the chart panel command center
      router.push("/admin/dashboard")
    } catch (err: any) {
      console.error("Authentication failed: ", err)
      setAuthError(err.message || "Invalid password or network signature.")
    } finally {
      setAuthLoading(false)
    }
  }

  // ⏳ INITIALIZATION SCREEN (Auth Handshake Loading)
  if (isAdmin === null) {
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

  // 🔒 THE SECURE LOCK SCREEN GATEWAY - FIXED: All text now visible
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fc] to-[#eef1f5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Flagship Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-br from-[#c9a84c] to-[#e8d5a3] rounded-xl flex items-center justify-center">
              <Crown className="w-5 h-5 text-[#1a1a2e]" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Orbit</h1>
              <p className="text-[10px] text-[#c9a84c] uppercase tracking-[0.2em] font-medium">Admin Console</p>
            </div>
          </div>
        </div>

        {/* Secure Form Sheet */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transform transition-all duration-300">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-[#1a1a2e]/20">
              <Lock className="w-6 h-6 text-[#c9a84c]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mt-3">Secure Access</h2>
            <p className="text-sm text-gray-600 mt-1">Enter your credentials to continue</p>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-600 font-medium">{authError}</p>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="text-left">
              <label className="text-sm font-bold text-gray-800 block mb-1">Email Address</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@orbitluxuries.com" 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all"
                  required 
                />
              </div>
            </div>

            <div className="text-left">
              <label className="text-sm font-bold text-gray-800 block mb-1">Passcode Key</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all"
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={authLoading}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-[#1a1a2e]/20 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 border-0 cursor-pointer text-sm"
            >
              {authLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying Cryptographic Tokens...
                </>
              ) : (
                <>
                  Unlock Secure Terminal
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-3 bg-gray-50 rounded-xl flex items-start gap-2 border border-gray-200">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-gray-600 text-left">Secure encrypted connection • 256-bit SSL • Continuous session logging protocol active</p>
          </div>
        </div>

      </div>
    </div>
  )
}