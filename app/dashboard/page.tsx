"use client"

import React from "react"
import Link from "next/link"
import { useStore } from "@/context/store-context"
import { ClipboardList, ShieldCheck, User, LogOut } from "lucide-react"

// 🎯 TYPESCRIPT INTERFACES TO KILL THE "PROPERTY NOT FOUND" ERRORS
interface OrderItem {
  name: string
  image: string
  size: string
  qty: number
}

interface DashboardOrder {
  id: string
  customerName: string
  totalAmount: number
  status: string
  items: OrderItem[]
}

export default function UserDashboardPage() {
  const { orders } = useStore()

  // Safely cast or fallback to static structured data to satisfy type safety
  const activeOrders: DashboardOrder[] = orders && orders.length > 0 
    ? (orders as unknown as DashboardOrder[])
    : [
        {
          id: "ORBIT-ORD-2401",
          customerName: "Sachin Tayagi",
          totalAmount: 18650,
          status: "Confirmed",
          items: [
            {
              name: "Classic Heritage Tailored Blazer",
              size: "M",
              qty: 1,
              image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80"
            }
          ]
        }
      ]

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 flex flex-col space-y-8 text-left">
      
      {/* HEADER NODES */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-neutral-200 pb-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif uppercase tracking-wider font-extrabold text-neutral-950">
            My Control Dashboard
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Logged context node: <span className="font-mono text-neutral-700">sachin@example.com</span>
          </p>
        </div>
        <button className="inline-flex items-center gap-2 border border-neutral-300 px-4 py-2 text-xs uppercase font-bold tracking-wider rounded-sm hover:bg-neutral-50 transition-colors">
          <LogOut className="w-3.5 h-3.5" /> Close Session
        </button>
      </div>

      {/* CORE GRID COMPONENT PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start w-full">
        
        {/* PROFILE SUMMARY LEFT COLUMN CARD */}
        <div className="lg:col-span-3 border border-neutral-200 rounded-sm bg-white overflow-hidden">
          <div className="p-5 flex items-center gap-3 border-b border-neutral-100 bg-neutral-50/40">
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
            <div>
              <h4 className="text-xs font-black text-neutral-900">Sachin Tayagi</h4>
              <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 mt-0.5">Premium Account</p>
            </div>
          </div>
          <nav className="flex flex-col text-xs font-semibold">
            <button className="w-full p-4 border-b border-neutral-100 flex justify-between items-center bg-white text-neutral-400 hover:text-black">
              <span className="flex items-center gap-2 text-neutral-900"><User className="w-4 h-4 text-neutral-400" /> Account Summary</span>
              <span>&gt;</span>
            </button>
            <button className="w-full p-4 flex justify-between items-center bg-black text-white">
              <span className="flex items-center gap-2"><ClipboardList className="w-4 h-4 text-[#DA1C5C]" /> Order History ({activeOrders.length})</span>
              <span>&gt;</span>
            </button>
          </nav>
        </div>

        {/* ORDER HISTORY DATA LEDGER GRID */}
        <div className="lg:col-span-9 bg-white border border-neutral-200 p-4 sm:p-6 rounded-sm space-y-6">
          <h3 className="text-xs uppercase tracking-widest font-black text-neutral-400 border-b border-neutral-100 pb-3">
            Procured Delivery History
          </h3>

          <div className="space-y-6">
            {activeOrders.map((order) => (
              <div key={order.id} className="border border-neutral-200 rounded-sm overflow-hidden bg-neutral-50/20">
                
                {/* CARD META ACTION STRIP */}
                <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex flex-wrap justify-between items-center gap-4 text-xs">
                  <div className="flex gap-6">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Order Token</p>
                      <p className="font-mono font-bold text-neutral-900">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Total Valuation</p>
                      <p className="font-bold text-neutral-950">₹{order.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* STATUS BADGE + DYNAMIC LIVE TRACK LINK BUTTON */}
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1.5 border border-amber-200 bg-amber-50 rounded-sm text-[10px] font-black tracking-wider text-amber-700 uppercase">
                      {order.status}
                    </span>
                    
                    <Link 
                      href={`/track/${order.id}`}
                      className="px-3 py-1.5 bg-neutral-950 hover:bg-[#DA1C5C] text-white text-[10px] font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer select-none"
                    >
                      Track Live
                    </Link>
                  </div>
                </div>

                {/* NESTED LINE ITEMS MAPPING LOOP WITH EXPLICIT TYPES */}
                <div className="p-4 bg-white divide-y divide-neutral-100">
                  {order.items?.map((item: OrderItem, index: number) => (
                    <div key={index} className="flex gap-4 items-center py-2 first:pt-0 last:pb-0 text-xs">
                      <img src={item.image} alt={item.name} className="w-12 h-14 object-cover border border-neutral-200 rounded-sm bg-neutral-50" />
                      <div>
                        <h5 className="font-bold text-neutral-900">{item.name}</h5>
                        <p className="text-[10px] tracking-wide text-neutral-400 uppercase mt-0.5">
                          Size: {item.size} | Qty: {item.qty}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>

          <div className="bg-neutral-50 border border-neutral-200 p-4 rounded text-xs text-neutral-600 flex items-center gap-2.5 font-medium w-full">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Fulfillment networks synchronized cleanly across secure cloud databases.</span>
          </div>
        </div>

      </div>
    </div>
  )
}