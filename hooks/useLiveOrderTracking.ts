"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { doc, onSnapshot } from "firebase/firestore"

export interface OrderDetails {
  id: string
  status: "Pending" | "Confirmed" | "Processing" | "Shipped" | "Delivered" | "Cancelled"
  customerName: string
  totalAmount: number
  // Add other properties if your model has them
}

export function useLiveOrderTracking(orderId: string) {
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId) return

    // 🎯 Set up the permanent direct websocket pipeline to that document card
    const docRef = doc(db, "orders", orderId)

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setOrder({ id: snapshot.id, ...snapshot.data() } as OrderDetails)
        } else {
          setError("Order document record missing from global tracks.")
        }
        setLoading(false)
      },
      (err) => {
        console.error("Snapshot stream interrupted:", err)
        setError(err.message)
        setLoading(false)
      }
    )

    // 🧹 Clean up the socket stream listener if the user leaves the page
    return () => unsubscribe()
  }, [orderId])

  return { order, loading, error }
}