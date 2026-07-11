// components/cards/expandable-order-card.tsx
"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Package, Truck, CheckCircle2, MapPin, CreditCard } from "lucide-react";

export function ExpandableOrderCard({ order }: { order: any }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Fallback date if Firebase timestamp is weird
  const orderDate = order.createdAt?.seconds 
    ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
    : "Recently";

  return (
    <div className="bg-white border border-neutral-200 rounded-sm mb-6 shadow-sm overflow-hidden transition-all duration-300">
      
      {/* THE HEADER (Always Visible) - Clickable */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-neutral-50 transition-colors gap-4"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full md:w-auto text-left">
          <div>
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mb-1">Order Placed</p>
            <p className="text-xs text-neutral-900">{orderDate}</p>
          </div>
          <div>
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mb-1">Total</p>
            <p className="text-xs text-neutral-900 font-bold">₹{order.totalAmount?.toLocaleString()}</p>
          </div>
          <div className="col-span-2 md:col-span-2">
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mb-1">Order ID</p>
            <p className="text-xs text-neutral-900 font-mono truncate max-w-[120px] sm:max-w-full">{order.id}</p>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t border-neutral-100 md:border-0 pt-4 md:pt-0">
          <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-sm border ${
            order.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
            order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
            'bg-neutral-100 text-neutral-700 border-neutral-200'
          }`}>
            {order.status || 'PENDING'}
          </span>
          <button className="text-neutral-500 hover:text-[#c9a84c] transition-colors border-0 bg-transparent flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider">
            {isExpanded ? 'Close Details' : 'View Details'}
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* THE EXPANDED DETAILS (Hidden until clicked) */}
      {isExpanded && (
        <div className="border-t border-neutral-200 bg-neutral-50/50 p-5 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Col: Items List */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-[11px] uppercase tracking-widest font-bold text-neutral-400 border-b border-neutral-200 pb-2">Procurement Manifest</h4>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-4 items-start bg-white p-3 border border-neutral-200 rounded-xs shadow-sm">
                    <img src={item.product?.image || '/images/placeholder.jpg'} alt={item.product?.name} className="w-16 h-20 object-cover bg-neutral-100 rounded-sm" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-neutral-900">{item.product?.name}</p>
                      <p className="text-[10px] uppercase tracking-wider text-neutral-500 mt-1">Size: {item.selectedSize || 'STD'} | Qty: {item.quantity}</p>
                      <p className="text-xs font-bold text-neutral-950 mt-2">₹{(item.product?.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: Order Meta Data */}
            <div className="space-y-6">
              {/* Status Tracker */}
              <div>
                <h4 className="text-[11px] uppercase tracking-widest font-bold text-neutral-400 border-b border-neutral-200 pb-2 mb-3">Order Status</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Order Confirmed</span>
                  </div>
                  <div className={`flex items-center gap-3 ${order.status !== 'PENDING' ? 'text-emerald-600' : 'text-neutral-400'}`}>
                    <Package className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Processing</span>
                  </div>
                  <div className={`flex items-center gap-3 ${order.status === 'DELIVERED' ? 'text-emerald-600' : 'text-neutral-400'}`}>
                    <Truck className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Dispatched</span>
                  </div>
                </div>
              </div>

              {/* Shipping & Payment */}
              <div>
                <h4 className="text-[11px] uppercase tracking-widest font-bold text-neutral-400 border-b border-neutral-200 pb-2 mb-3">Logistics & Settlement</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-2.5 text-neutral-700">
                    <MapPin className="w-4 h-4 text-[#c9a84c] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-0.5">Shipping Node</p>
                      <p className="text-xs leading-relaxed">{order.shippingAddress || 'Address unavailable'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 text-neutral-700">
                    <CreditCard className="w-4 h-4 text-[#c9a84c] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-0.5">Payment Channel</p>
                      <p className="text-xs">{order.paymentMethod || 'Standard Gateway'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}