"use client"

import React from "react"
import Link from "next/link"
import { useStore } from "@/context/store-context"
import OrderStatusCard from "@/components/cards/order-status-card" // Fixed path here
import { ExpandableOrderCard } from "@/components/cards/expandable-order-card";
import { ShoppingCart } from "lucide-react"

export default function CustomerOrdersHistoryPage() {
  const { orders } = useStore()

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-12 py-12 text-left space-y-8 animate-fade-in">
      <div className="border-b border-neutral-200 pb-4">
        <h1 className="text-2xl font-serif uppercase tracking-wide">Procurement Dispatches</h1>
        <p className="text-xs text-neutral-400 mt-1">Real-time delivery progress monitoring charts.</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-neutral-200 rounded flex flex-col items-center justify-center space-y-4">
          <ShoppingCart className="w-8 h-8 text-neutral-300 stroke-[1.2]" />
          <p className="text-xs uppercase tracking-widest text-neutral-400">Zero active order vectors found inside configuration profile memory loops.</p>
          <Link href="/catalog" className="text-xs uppercase tracking-widest font-bold text-[#DA1C5C] hover:underline">Begin Explorations →</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderStatusCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}