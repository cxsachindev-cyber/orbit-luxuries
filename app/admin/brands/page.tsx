"use client"

import React from "react"
import { Layers } from "lucide-react"

export default function AdminPlaceholderPanel() {
  return (
    <div className="p-6 lg:p-10 text-left w-full space-y-4">
      <h2 className="text-2xl font-serif uppercase tracking-wide font-bold">Management Matrix Module</h2>
      <div className="py-16 border border-dashed border-neutral-200 rounded text-center text-neutral-400 text-xs uppercase tracking-widest bg-white">
        System Node Operational / Awaiting Backend Pipeline Sync
      </div>
    </div>
  )
}