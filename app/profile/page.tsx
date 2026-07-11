"use client"

import React, { useState } from "react"
import { useStore } from "@/context/store-context"
import { ShoppingBag, User, LogOut, Loader2 } from "lucide-react"
import { ExpandableOrderCard } from "@/components/cards/expandable-order-card";

export default function ProfileDashboardPage() {
  const { orders, user, authLoading, logoutUser } = useStore()
  const [activeTab, setActiveTab] = useState("overview")

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-2 bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#DA1C5C]" />
        <p className="text-xs text-neutral-400 uppercase tracking-widest font-semibold">Loading Profile...</p>
      </div>
    )
  }

  const displayName = user?.displayName || user?.email?.split('@')[0] || "Premium Shopper"
  const userInitial = displayName ? displayName[0].toUpperCase() : "U"

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-12 py-12 text-left space-y-8 animate-fade-in bg-white min-h-[70vh]">
      <div className="border-b border-neutral-200 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl text-neutral-900 font-serif uppercase tracking-wider font-extrabold">My Account</h1>
          <p className="text-xs text-neutral-500 mt-2 tracking-wide uppercase">Manage your premium profile and orders</p>
        </div>
        <button onClick={logoutUser} className="inline-flex items-center gap-2 text-neutral-500 border border-neutral-300 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-neutral-50 hover:text-black transition-colors cursor-pointer">
          <LogOut className="w-3 h-3" /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* SIDEBAR TABS */}
        <div className="md:col-span-3 border border-neutral-200 rounded-sm overflow-hidden bg-white shadow-xs divide-y divide-neutral-100">
          <div className="p-5 flex items-center space-x-4 bg-neutral-50/50">
            <div className="w-12 h-12 bg-black text-[#c9a84c] rounded-full flex items-center justify-center font-serif text-lg font-bold uppercase shadow-inner">
              {userInitial}
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-900 tracking-wide">{displayName}</p>
              <p className="text-[9px] text-neutral-500 uppercase tracking-widest mt-1">Premium Member</p>
            </div>
          </div>

          <button onClick={() => setActiveTab("overview")} className={`w-full flex items-center justify-between px-5 py-4 text-[11px] font-bold uppercase tracking-widest border-0 cursor-pointer text-left transition-colors ${activeTab === "overview" ? "bg-black text-white" : "bg-white text-neutral-700 hover:bg-neutral-50"}`}>
            <span className="flex items-center gap-3"><User className="w-4 h-4" /> Account Details</span>
            <span>&gt;</span>
          </button>

          <button onClick={() => setActiveTab("orders")} className={`w-full flex items-center justify-between px-5 py-4 text-[11px] font-bold uppercase tracking-widest border-0 cursor-pointer text-left transition-colors ${activeTab === "orders" ? "bg-black text-white" : "bg-white text-neutral-700 hover:bg-neutral-50"}`}>
            <span className="flex items-center gap-3"><ShoppingBag className="w-4 h-4" /> Order History ({orders.length})</span>
            <span>&gt;</span>
          </button>
        </div>

        {/* MAIN VIEWPORT */}
        <div className="md:col-span-9 bg-white border border-neutral-200 p-8 rounded-sm shadow-xs min-h-[40vh]">
          {activeTab === "overview" && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xs uppercase tracking-widest font-bold text-neutral-900 border-b border-neutral-100 pb-3">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="border border-neutral-100 p-5 rounded-xs bg-neutral-50/50">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-600 block mb-2">Registered Name</span>
                  <span className="text-sm font-bold text-neutral-900">{displayName}</span>
                </div>
                <div className="border border-neutral-100 p-5 rounded-xs bg-neutral-50/50">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-600 block mb-2">Email Address</span>
                  <span className="text-sm font-medium text-neutral-900">{user?.email}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xs uppercase tracking-widest font-bold text-neutral-900 border-b border-neutral-100 pb-3">Recent Purchases</h3>
              
              {orders.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-neutral-200 rounded-sm bg-neutral-50/50 space-y-3">
                  <p className="text-xs text-neutral-500 uppercase tracking-widest font-medium">You have not placed any orders yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* ✅ CLEAN REPLACEMENT: Mapping directly to the ExpandableOrderCard */}
                  {orders.map((order: any) => (
                    <ExpandableOrderCard key={order.id} order={order} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}