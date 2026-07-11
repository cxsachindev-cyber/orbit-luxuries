// components/cards/order-status-card.tsx
"use client"

import React from "react"
import { Order } from "@/context/store-context"
import { 
  Clock, 
  Truck, 
  PackageCheck, 
  CheckCircle, 
  XCircle,
  Package,
  User,
  Calendar,
  MapPin,
  CreditCard,
  ChevronRight
} from "lucide-react"

export default function OrderStatusCard({ order }: { order: Order }) {
  const steps = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"]
  const currentIdx = order.status === "Cancelled" ? -1 : steps.indexOf(order.status)
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case "pending": return "bg-amber-50 text-amber-700 border-amber-200"
      case "confirmed": return "bg-blue-50 text-blue-700 border-blue-200"
      case "processing": return "bg-purple-50 text-purple-700 border-purple-200"
      case "shipped": return "bg-indigo-50 text-indigo-700 border-indigo-200"
      case "delivered": return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "cancelled": return "bg-red-50 text-red-700 border-red-200"
      default: return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch(status?.toLowerCase()) {
      case "pending": return <Clock className="w-4 h-4" />
      case "confirmed": return <CheckCircle className="w-4 h-4" />
      case "processing": return <Package className="w-4 h-4" />
      case "shipped": return <Truck className="w-4 h-4" />
      case "delivered": return <PackageCheck className="w-4 h-4" />
      case "cancelled": return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  // Format date - FIXED: Use orderDate instead of createdAt
  const formatDate = (date: any) => {
    if (!date) return "N/A"
    try {
      // Handle Firestore Timestamp
      const dateObj = date.toDate ? date.toDate() : new Date(date)
      return dateObj.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    } catch {
      return "N/A"
    }
  }

  // Get order items with fallbacks
  const orderItems = order.items || []
  const orderDate = order.orderDate || order.createdAt || new Date()
  const paymentMethod = order.paymentMethod || "Online Payment"
  const shippingAddress = order.shippingAddress || "Address not provided"
  const totalAmount = order.totalAmount || 0

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#c9a84c]/20 rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5 text-[#c9a84c]" />
          </div>
          <div>
            <p className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">Order Reference</p>
            <p className="text-sm font-mono font-bold text-white">{order.id || "N/A"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            {order.status || "Pending"}
          </span>
          <span className="text-sm font-bold text-white">
            ₹{totalAmount.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Customer Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Customer</p>
              <p className="text-sm font-medium text-gray-900">{order.customerName || "Guest"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Order Date</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(orderDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Payment</p>
              <p className="text-sm font-medium text-gray-900">{paymentMethod}</p>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-3">Order Items ({orderItems.length})</p>
          <div className="space-y-2">
            {orderItems.map((item: any, index: number) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="w-14 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                  <img 
                    src={item.product?.image || '/images/placeholder.jpg'} 
                    alt={item.product?.name || "Product"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.product?.name || "Product"}</p>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    <span className="text-xs text-gray-500">Size: {item.selectedSize || "N/A"}</span>
                    <span className="text-xs text-gray-500">Qty: {item.quantity || 1}</span>
                    <span className="text-xs font-semibold text-gray-900">
                      ₹{((item.product?.price || 0) * (item.quantity || 1)).toLocaleString()}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Shipping Address</p>
            <p className="text-sm text-gray-700">{shippingAddress}</p>
          </div>
        </div>

        {/* Timeline */}
        {order.status?.toLowerCase() === "cancelled" ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-700">Order Cancelled</p>
              <p className="text-xs text-red-600">This order has been cancelled and will not be processed.</p>
            </div>
          </div>
        ) : (
          <div className="pt-2">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-4">Order Progress</p>
            <div className="relative">
              {/* Progress Bar Background */}
              <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 rounded-full" />
              
              {/* Progress Bar Fill */}
              <div 
                className="absolute top-4 left-0 h-1 bg-gradient-to-r from-[#c9a84c] to-[#e8d5a3] rounded-full transition-all duration-1000"
                style={{ 
                  width: currentIdx >= 0 ? `${(currentIdx / (steps.length - 1)) * 100}%` : '0%' 
                }}
              />
              
              {/* Steps */}
              <div className="relative flex justify-between">
                {steps.map((step, idx) => {
                  const isPast = idx <= currentIdx
                  const isCurrent = idx === currentIdx
                  
                  return (
                    <div key={step} className="flex flex-col items-center gap-2 flex-1">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                        ${isPast 
                          ? 'bg-gradient-to-br from-[#c9a84c] to-[#e8d5a3] text-[#1a1a2e] shadow-lg shadow-[#c9a84c]/30' 
                          : 'bg-gray-200 text-gray-400'
                        }
                        ${isCurrent && 'ring-4 ring-[#c9a84c]/20 scale-110'}
                      `}>
                        {isPast ? (
                          idx === steps.length - 1 ? <PackageCheck className="w-4 h-4" /> :
                          idx === 3 ? <Truck className="w-4 h-4" /> :
                          idx === 2 ? <Package className="w-4 h-4" /> :
                          idx === 1 ? <CheckCircle className="w-4 h-4" /> :
                          <Clock className="w-4 h-4" />
                        ) : (
                          idx + 1
                        )}
                      </div>
                      <span className={`
                        text-[9px] uppercase tracking-wider font-bold text-center
                        ${isPast ? 'text-[#c9a84c]' : 'text-gray-400'}
                      `}>
                        {step}
                      </span>
                      {isCurrent && (
                        <span className="text-[8px] text-[#c9a84c] font-medium animate-pulse">
                          In Progress
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
          <button className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#1a1a2e]/20 transition-all duration-300">
            Track Order
          </button>
          <button className="flex-1 sm:flex-none px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-300">
            Contact Support
          </button>
          {order.status?.toLowerCase() !== "delivered" && order.status?.toLowerCase() !== "cancelled" && (
            <button className="flex-1 sm:flex-none px-6 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-all duration-300">
              Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  )
}