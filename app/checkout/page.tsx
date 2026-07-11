// app/checkout/page.tsx
"use client"

import React, { useState, useEffect } from "react"
import { useStore } from "@/context/store-context"
import { useRouter } from "next/navigation"
import { db, auth } from "@/lib/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { ShieldCheck, CreditCard, MapPin, ArrowRight, Loader2, Smartphone, Landmark, Banknote } from "lucide-react"

export default function CheckoutPage() {
  const { cart = [], createOrder, user, authLoading } = useStore()
  const router = useRouter()

  // --- FORM STATES ---
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [pincode, setPincode] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<string>("COD")
  const [fetchingDetails, setFetchingDetails] = useState(true)
  
  // ✅ NEW: State to control our custom luxury popup
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)

  // 🔒 SECURE ACCOUNTS PIPELINE & DATA HYDRATION LAYER
  useEffect(() => {
    if (!authLoading && !user) {
      alert("Authentication required. Please sign in to authorize checkout operations. 🔒")
      router.push("/auth/login")
      return
    }

    const fetchUserShippingProfile = async () => {
      if (!user?.uid) return
      setFetchingDetails(true)
      try {
        const docRef = doc(db, "users", user.uid, "profile", "shippingDetails")
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const data = docSnap.data()
          setName(data.fullName || "")
          setPhone(data.phone || "")
          setAddress(data.address || "")
          setPincode(data.pincode || "")
        } else {
          setName("")
          setPhone("")
          setAddress("")
          setPincode("")
        }
      } catch (err) {
        console.error("Failed to query user credentials from secure node:", err)
      } finally {
        setFetchingDetails(false)
      }
    }

    if (user) {
      fetchUserShippingProfile()
    }
  }, [user, authLoading, router])

  const selectedCheckoutItems = cart.filter(item => item.selected)

  const actualBillSum = selectedCheckoutItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0)
  const handlingTax = actualBillSum > 0 ? 150 : 0
  const ultimatePayoutValue = actualBillSum + handlingTax

  const handleOrderSubmission = async (e: React.FormEvent) => {
    e.preventDefault()
    const activeUid = user?.uid || auth.currentUser?.uid
    
    if (!activeUid) {
      alert("Session lost. Please log in again to securely place your order.")
      router.push("/auth/login")
      return
    }
    
    if (!name || !address || !pincode || !phone) {
      alert("Please populate all secure shipping network keys.")
      return
    }

    if (selectedCheckoutItems.length === 0) {
      alert("Your selection matrix contains 0 items. Please check products in your bag.")
      return
    }

    // 1. SANITIZE FINANCIALS
    const safeBillSum = selectedCheckoutItems.reduce((acc, curr) => {
      const price = Number(curr.price) || 0;
      const qty = Number(curr.quantity) || 1;
      return acc + (price * qty);
    }, 0);
    const safeHandlingTax = safeBillSum > 0 ? 150 : 0;
    const safeTotalAmount = safeBillSum + safeHandlingTax;

    try {
      const activeEmail = user?.email || auth.currentUser?.email || "customer@orbit.com"

      // Save/Update shipping details in profile
      const shippingProfileRef = doc(db, "users", activeUid, "profile", "shippingDetails")
      await setDoc(shippingProfileRef, {
        fullName: name,
        phone: phone,
        address: address,
        pincode: pincode,
        lastUpdated: new Date().toISOString()
      }, { merge: true })

      // 2. SANITIZE PAYLOAD
      const sanitizedItems = selectedCheckoutItems.map(item => ({
        product: {
          id: item.id || "unknown_id",
          name: item.name || "Premium Luxury Item",
          brand: item.brand || "Orbit Luxuries",
          price: Number(item.price) || 0,
          originalPrice: Number(item.originalPrice) || Number(item.price) || 0,
          description: item.description || "Curated luxury piece.",
          category: item.category || "General",
          image: item.image || "",
          images: Array.isArray(item.images) ? item.images : (item.image ? [item.image] : []),
          sizes: Array.isArray(item.sizes) ? item.sizes : [],
          specs: Array.isArray(item.specs) ? item.specs : [],
        },
        quantity: Number(item.quantity) || 1,
        selectedSize: item.chosenSize || "Standard" 
      }));

      // 3. EXECUTE SAFE ORDER
      await createOrder({
        customerName: name,
        customerEmail: activeEmail,
        customerPhone: phone,
        shippingAddress: `${address}, Pin: ${pincode}`,
        paymentMethod: paymentMethod || "COD",
        items: sanitizedItems,
        totalAmount: safeTotalAmount
      })

      // ✅ Trigger our luxury popup instead of the browser alert!
      setShowSuccessPopup(true)
      
    } catch (err: any) {
      console.error("Checkout validation crash loop intercepted:", err)
      alert("Order compilation failed. Please check the browser console (F12) for the exact database error.")
    }
  }

  if (authLoading || fetchingDetails) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-2 bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#DA1C5C]" />
        <p className="text-xs text-neutral-400 uppercase tracking-widest font-semibold">Resolving Account Profile Nodes...</p>
      </div>
    )
  }

  if (selectedCheckoutItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center space-y-4 bg-white min-h-[60vh]">
        <h2 className="text-lg uppercase tracking-widest font-serif font-bold text-neutral-900">No Items Selected</h2>
        <p className="text-xs text-neutral-500">Please go back to your shopping bag workspace and check the items you want to purchase.</p>
        <button onClick={() => router.push("/cart")} className="mt-4 bg-neutral-950 text-white text-xs uppercase font-bold tracking-widest px-6 py-3 hover:bg-[#DA1C5C] transition-colors border-0 cursor-pointer rounded-sm">
          Return to Bag
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900 relative">
      <div className="max-w-7xl mx-auto px-4 lg:px-12 py-12 flex flex-col space-y-6 text-left animate-fade-in">
        <h1 className="text-2xl font-serif font-bold uppercase tracking-wide border-b border-neutral-100 pb-4 text-neutral-900">Secure Checkout Gateway</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT COLUMN: SECURE SHIPPING CONFIGURATION FORM */}
          <form onSubmit={handleOrderSubmission} className="lg:col-span-7 space-y-6 bg-white border border-neutral-200 p-6 rounded-sm shadow-xs">
            <h3 className="text-xs uppercase tracking-widest font-bold text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pb-3">
              <MapPin className="w-4 h-4 text-[#DA1C5C]" /> Shipping Destination Credentials
            </h3>

            <div className="space-y-4 text-black">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Consignee Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sachin Tayagi" className="border border-neutral-200 text-xs rounded-sm p-3 bg-neutral-50 text-black focus:outline-none focus:bg-white focus:border-neutral-900 transition-colors" required />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Street Address Location Node</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g. Sector 4, Betiahata South" className="border border-neutral-200 text-xs rounded-sm p-3 bg-neutral-50 text-black focus:outline-none focus:bg-white focus:border-neutral-900 transition-colors" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Postal Zip / Pincode</label>
                  <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="e.g. 273001" className="border border-neutral-200 text-xs rounded-sm p-3 bg-neutral-50 text-black focus:outline-none focus:bg-white focus:border-neutral-900 transition-colors" required />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Contact Gateway Number</label>
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 6387467185" className="border border-neutral-200 text-xs rounded-sm p-3 bg-neutral-50 text-black focus:outline-none focus:bg-white focus:border-neutral-900 transition-colors" required />
                </div>
              </div>
            </div>

            {/* SETTLEMENT CHANNELS */}
            <h3 className="text-xs uppercase tracking-widest font-bold text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pt-4 pb-3">
              <CreditCard className="w-4 h-4 text-[#DA1C5C]" /> Settlement Channel Matrix
            </h3>
            
            <div className="space-y-3">
              <label className={`border p-4 rounded-sm flex items-center justify-between cursor-pointer transition-colors ${paymentMethod === "UPI" ? "border-neutral-900 bg-neutral-50/50" : "border-neutral-200 bg-white"}`}>
                <div className="flex items-center space-x-3">
                  <input type="radio" name="payment" checked={paymentMethod === "UPI"} onChange={() => setPaymentMethod("UPI")} className="accent-[#DA1C5C]" />
                  <div className="text-left flex items-center gap-2.5">
                    <Smartphone className="w-4 h-4 text-[#DA1C5C] shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-neutral-900">Instant UPI Node (PhonePe / GPay / BHIM)</p>
                      <p className="text-[10px] text-neutral-500">Settle routing instantly using secure virtual payment addresses.</p>
                    </div>
                  </div>
                </div>
              </label>

              <label className={`border p-4 rounded-sm flex items-center justify-between cursor-pointer transition-colors ${paymentMethod === "Card" ? "border-neutral-900 bg-neutral-50/50" : "border-neutral-200 bg-white"}`}>
                <div className="flex items-center space-x-3">
                  <input type="radio" name="payment" checked={paymentMethod === "Card"} onChange={() => setPaymentMethod("Card")} className="accent-[#DA1C5C]" />
                  <div className="text-left flex items-center gap-2.5">
                    <CreditCard className="w-4 h-4 text-[#DA1C5C] shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-neutral-900">Premium Credit / Debit Cards</p>
                      <p className="text-[10px] text-neutral-500">Accepting Visa, Mastercard, RuPay, and American Express lines.</p>
                    </div>
                  </div>
                </div>
              </label>

              <label className={`border p-4 rounded-sm flex items-center justify-between cursor-pointer transition-colors ${paymentMethod === "NetBanking" ? "border-neutral-900 bg-neutral-50/50" : "border-neutral-200 bg-white"}`}>
                <div className="flex items-center space-x-3">
                  <input type="radio" name="payment" checked={paymentMethod === "NetBanking"} onChange={() => setPaymentMethod("NetBanking")} className="accent-[#DA1C5C]" />
                  <div className="text-left flex items-center gap-2.5">
                    <Landmark className="w-4 h-4 text-[#DA1C5C] shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-neutral-900">Secure Corporate Net Banking</p>
                      <p className="text-[10px] text-neutral-500">Authorize routing tokens straight through major Indian banking servers.</p>
                    </div>
                  </div>
                </div>
              </label>

              <label className={`border p-4 rounded-sm flex items-center justify-between cursor-pointer transition-colors ${paymentMethod === "COD" ? "border-neutral-900 bg-neutral-50/50" : "border-neutral-200 bg-white"}`}>
                <div className="flex items-center space-x-3">
                  <input type="radio" name="payment" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} className="accent-[#DA1C5C]" />
                  <div className="text-left flex items-center gap-2.5">
                    <Banknote className="w-4 h-4 text-[#DA1C5C] shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-neutral-900">Premium Cash On Delivery (COD)</p>
                      <p className="text-[10px] text-neutral-500">Settle your payout amount securely upon physical verification at your door.</p>
                    </div>
                  </div>
                </div>
              </label>
            </div>

            <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-neutral-950 text-white text-xs font-bold uppercase tracking-widest py-4 hover:bg-[#DA1C5C] transition-colors rounded-sm shadow-xl shadow-neutral-950/5 cursor-pointer border-0 mt-4">
              Authorize Order Settlement ({paymentMethod}) <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* RIGHT COLUMN: RE-CALCULATED PRICING SUMMARY MATRIX */}
          <div className="lg:col-span-5 bg-neutral-50 border border-neutral-200 p-6 rounded-sm space-y-6">
            <h3 className="text-xs uppercase tracking-widest font-bold text-neutral-900 border-b border-neutral-200 pb-3">Procurement Manifest</h3>

            <div className="max-h-[340px] overflow-y-auto space-y-3 pr-2">
              {selectedCheckoutItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs bg-white border border-neutral-200 p-3 rounded-xs shadow-sm">
                  <div className="flex items-center space-x-4 text-left">
                    <img src={item.image} className="w-10 h-12 object-cover rounded-sm bg-neutral-100 border border-neutral-100" alt="" />
                    <div>
                      <p className="font-bold text-neutral-900 line-clamp-1">{item.name}</p>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-wide mt-0.5">Size: {item.chosenSize || "Standard"} × Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-neutral-950">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2.5 text-xs text-neutral-600 border-t border-b border-neutral-200 py-4">
              <div className="flex justify-between"><span>Subtotal Valuation</span><span className="text-neutral-900 font-medium">₹{actualBillSum.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Insured Processing Tax</span><span className="text-neutral-900 font-medium">₹{handlingTax.toLocaleString()}</span></div>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">Total Bill Payout</span>
              <span className="text-xl font-black text-neutral-950">₹{ultimatePayoutValue.toLocaleString()}</span>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] p-3 rounded-xs flex items-center gap-2 uppercase tracking-wider font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" /> End-to-End Encrypted Handover Architecture
            </div>
          </div>
        </div>
      </div>

      {/* ✅ LUXURY SUCCESS POPUP */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-[#0a0a0a] border border-[#c9a84c] p-10 md:p-14 max-w-md w-full text-center shadow-2xl relative">
            
            {/* Gold Check/Diamond SVG Icon */}
            <div className="mx-auto w-14 h-14 mb-6 text-[#c9a84c]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
              </svg>
            </div>

            <h3 className="text-2xl font-serif text-white mb-4">Order Confirmed</h3>
            <p className="text-white/60 text-sm mb-10 leading-relaxed font-light">
              Your luxury order has been committed securely via {paymentMethod}. Thank you for shopping with Orbit Luxuries.
            </p>
            
            <button 
              onClick={() => {
                setShowSuccessPopup(false);
                router.push('/profile?tab=orders');
              }} 
              className="bg-[#c9a84c] text-black w-full py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-[#d4b85c] transition-colors border-0 cursor-pointer"
            >
              View Order History
            </button>
          </div>
        </div>
      )}
    </div>
  )
}