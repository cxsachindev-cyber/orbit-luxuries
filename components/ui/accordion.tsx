"use client"

import React, { useState } from "react"
import { ChevronDown } from "lucide-react"

export function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border-b border-neutral-200 py-3 text-left">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center text-[11px] uppercase tracking-wider font-bold text-neutral-400 py-1.5">
        <span>{title}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="pt-2 animate-slide-down">{children}</div>}
    </div>
  )
}