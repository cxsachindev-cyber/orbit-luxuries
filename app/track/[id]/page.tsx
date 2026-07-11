"use client"

import React from "react"
import { useParams } from "next/navigation"
import { useLiveOrderTracking } from "@/hooks/useLiveOrderTracking"
import { CheckCircle2, Clock, Box, Truck, PackageCheck, AlertTriangle } from "lucide-react"

export default function LiveOrderTrackingPage() {
  const params = useParams()
  const orderId = params.id as string

  // Stream live data updates straight from the cloud!
  const { order, loading, error } = useLiveOrderTracking(orderId)

  // Mapping stages index counts
  const stages = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"]
  const currentStageIndex = order ? stages.indexOf(order.status) : 0

  if (loading) return <div className="text-center py-20 font-mono text-xs text-neutral-400">CONNECTING LIVE ORDER LOGISTICS FEED...</div>
  if (error || !order) return (
    <div className="max-w-md mx-auto text-center py-25 space-y-3">
      <AlertTriangle className="w-8 h-8 mx-auto text-red-500" />
      <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Tracking Pipeline Error</h3>
      <p className="text-xs text-neutral-400">{error || "Invalid order reference node ID."}</p>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-left">
      <div className="border-b border-neutral-200 pb-6 mb-10">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#DA1C5C]">Live Tracking Node</span>
        <h1 className="text-2xl font-serif font-black uppercase tracking-wider text-neutral-950 mt-1">
          CONSIGNMENT ID: <span className="font-mono text-neutral-700">{order.id}</span>
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Hello {order.customerName}, your total invoice settlement values sit at <span className="font-bold text-neutral-900">₹{order.totalAmount.toLocaleString()}</span>.
        </p>
      </div>

      {order.status === "Cancelled" ? (
        <div className="bg-red-50 border border-red-200 rounded p-4 text-xs font-semibold text-red-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> This luxury order block was cancelled and shipment pipelines were terminated.
        </div>
      ) : (
        /* THE GRAPHICAL REAL-TIME TIMELINE BAR GRID */
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center w-full space-y-6 md:space-y-0 md:space-x-4">
          
          {/* HORIZONTAL LINE CONNECTOR (Only visible on desktop viewports) */}
          <div className="absolute hidden md:block top-[22px] left-8 right-8 h-[2px] bg-neutral-100 -z-10">
            <div 
              className="h-full bg-emerald-600 transition-all duration-500" 
              style={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
            />
          </div>

          {stages.map((stage, idx) => {
            const isCompleted = idx <= currentStageIndex
            const isCurrent = idx === currentStageIndex

            return (
              <div key={stage} className="flex md:flex-col items-center md:text-center space-x-4 md:space-x-0 md:space-y-2 w-full md:w-auto relative">
                
                {/* STAGE ICON MAPPER */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted 
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-100" 
                    : "bg-white border-neutral-200 text-neutral-400"
                } ${isCurrent ? "scale-110 ring-4 ring-emerald-50" : ""}`}>
                  {stage === "Pending" && <Clock className="w-5 h-5" />}
                  {stage === "Confirmed" && <CheckCircle2 className="w-5 h-5" />}
                  {stage === "Processing" && <Box className="w-5 h-5" />}
                  {stage === "Shipped" && <Truck className="w-5 h-5" />}
                  {stage === "Delivered" && <PackageCheck className="w-5 h-5" />}
                </div>

                {/* TEXT ANCHOR STYLING */}
                <div>
                  <p className={`text-xs uppercase tracking-wider font-bold ${isCompleted ? "text-neutral-950" : "text-neutral-400"}`}>
                    {stage}
                  </p>
                  <p className="text-[10px] text-neutral-400 hidden md:block mt-0.5">
                    {isCurrent ? "In Transit" : isCompleted ? "Complete" : "Queued"}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}