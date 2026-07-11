"use client"

import React, { useState } from "react"
import { useStore } from "@/context/store-context"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { ShieldCheck, UserPlus, LogIn, Loader2, AlertTriangle } from "lucide-react"

export default function SmoothEcomAuthPage() {
  const { loginUser } = useStore()
  const router = useRouter()
  
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  
  // ⚡ Live Network Loading & Async pipeline error logs
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleAuthenticationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    
    setError("")
    setLoading(true)

    try {
      if (isSignUp) {
        // ➡️ 1. FIREBASE SIGN-UP STREAM
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        // Save new customer profile card directly into your Firestore "users" collection
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: name || "Premium Shopper",
          email: email,
          role: "customer", // Default customer role tag
          accountType: "Customer",
          createdAt: new Date()
        })
        
        loginUser(email)
        alert("Account created successfully! 🎉")
      } else {
        // ➡️ 2. FIREBASE SIGN-IN STREAM
        await signInWithEmailAndPassword(auth, email, password)
        loginUser(email)
      }
      
      // Send authenticated shopper back to your catalog storefront landing page!
      router.push("/")
    } catch (err: any) {
      console.error("Auth Pipeline Interruption: ", err)
      
      // Convert raw Firebase error messages into clean friendly text
      if (err.code === "auth/email-already-in-use") {
        setError("This email configuration is already bound to an active shopper account.")
      } else if (err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        setError("Invalid email address or security token password.")
      } else if (err.code === "auth/weak-password") {
        setError("Your security access cipher must be at least 6 characters long.")
      } else {
        setError(err.message || "E-commerce validation node dropped connection.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto my-6 sm:my-20 px-4 transition-all duration-200">
      <div className="border border-neutral-200 bg-white rounded-sm p-4 sm:p-6 text-left shadow-xs space-y-6">
        
        {/* Sign In / Sign Up Toggles */}
        <div className="grid grid-cols-2 border-b border-neutral-200 text-xs font-bold uppercase tracking-wider text-center">
          <button 
            type="button" 
            disabled={loading}
            onClick={() => { setIsSignUp(false); setError("") }} 
            className={`pb-3 bg-transparent border-0 cursor-pointer transition-colors ${!isSignUp ? "border-b-2 border-[#DA1C5C] text-neutral-900 font-black" : "text-neutral-400 hover:text-neutral-600"}`}
          >
            Sign In
          </button>
          <button 
            type="button" 
            disabled={loading}
            onClick={() => { setIsSignUp(true); setError("") }} 
            className={`pb-3 bg-transparent border-0 cursor-pointer transition-colors ${isSignUp ? "border-b-2 border-[#DA1C5C] text-neutral-900 font-black" : "text-neutral-400 hover:text-neutral-600"}`}
          >
            Sign Up
          </button>
        </div>

        {/* Live Warning Notification Alert Sheet */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 p-3 rounded-xs text-[11px] font-semibold flex items-start gap-2 leading-relaxed animate-fade-in">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Input Interactive Fields */}
        <form onSubmit={handleAuthenticationSubmit} className="space-y-4">
          {isSignUp && (
            <div className="flex flex-col space-y-1 animate-fade-in">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Full Name</label>
              <input 
                type="text" value={name} onChange={e => setName(e.target.value)} 
                placeholder="Sachin Tayagi" 
                disabled={loading}
                className="w-full border p-3 text-xs rounded-xs bg-neutral-50 focus:outline-none focus:bg-white focus:border-neutral-900 transition-colors text-black disabled:opacity-50" 
                required={isSignUp} 
              />
            </div>
          )}

          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Email Address</label>
            <input 
              type="email" value={email} onChange={e => setEmail(e.target.value)} 
              placeholder="sachintayag80@gmail.com" 
              disabled={loading}
              className="w-full border p-3 text-xs rounded-xs bg-neutral-50 focus:outline-none focus:bg-white focus:border-neutral-900 transition-colors text-black disabled:opacity-50" 
              required 
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Password</label>
            <input 
              type="password" value={password} onChange={e => setPassword(e.target.value)} 
              placeholder="••••••••" 
              disabled={loading}
              className="w-full border p-3 text-xs rounded-xs bg-neutral-50 focus:outline-none focus:bg-white focus:border-neutral-900 transition-colors text-black disabled:opacity-50" 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-neutral-950 text-white py-3.5 text-xs uppercase font-bold tracking-widest hover:bg-[#DA1C5C] transition-colors rounded-xs inline-flex items-center justify-center gap-2 mt-2 cursor-pointer shadow-sm border-0 disabled:bg-neutral-300 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                Validating Token Credentials...
              </>
            ) : (
              <>
                {isSignUp ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                {isSignUp ? "Register & Shop" : "Verify & Continue"}
              </>
            )}
          </button>
        </form>

        {/* Security Shield Indicator */}
        <div className="bg-neutral-50 border border-neutral-200 p-3 rounded-xs flex items-center gap-2.5 text-neutral-500 text-[10px] uppercase font-semibold tracking-wider w-full">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" /> Secure Token Gateway Layer Active
        </div>
      </div>
    </div>
  )
}