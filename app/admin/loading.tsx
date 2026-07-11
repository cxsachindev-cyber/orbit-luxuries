import React from "react"
import { Crown } from "lucide-react"

export default function AdminLoading() {
  return (
    <div className="w-full h-[80vh] flex flex-col items-center justify-center">
      <div className="relative">
        {/* The spinning outer ring */}
        <div className="w-16 h-16 border-4 border-[#c9a84c]/20 border-t-[#c9a84c] rounded-full animate-spin"></div>
        {/* The static inner icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Crown className="w-6 h-6 text-[#c9a84c]" />
        </div>
      </div>
      <p className="mt-6 text-sm font-bold uppercase tracking-widest text-gray-400 animate-pulse">
        Loading Workspace...
      </p>
    </div>
  )
}