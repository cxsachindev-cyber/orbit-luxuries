"use client"

import React, { useState } from "react"
// This imports the clear context connection we built together earlier
import { useStore } from "../context/store-context" 

export default function AdminProductUploadForm() {
  const { addNewProduct } = useStore()
  
  // Base Form States
  const [name, setName] = useState("")
  const [brand, setBrand] = useState("")
  const [category, setCategory] = useState("Fashion")
  const [price, setPrice] = useState("")
  const [originalPrice, setOriginalPrice] = useState("")
  const [description, setDescription] = useState("")
  
  // Media Upload States
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageFile) return alert("Please select a product image file from your computer first!")

    try {
      setUploading(true)

      // 1. Pack the local binary file into an HTTP multi-part payload bundle
      const formData = new FormData()
      formData.append("file", imageFile)
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)

      // 2. Stream the file directly to Cloudinary's media vault endpoints
      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      )

      if (!cloudinaryResponse.ok) throw new Error("Cloudinary media stream allocation rejected.")
      const mediaData = await cloudinaryResponse.json()
      
      // 🎯 THE PRIZE: Grab the high-speed, permanently optimized WebP CDN image link!
      const finalCloudinaryImageUrl = mediaData.secure_url

      // 3. Pipe the text variables + the clean cloud image link straight to your Firestore DB
      await addNewProduct({
        name,
        brand,
        category,
        price: Number(price),
        originalPrice: Number(originalPrice),
        image: finalCloudinaryImageUrl,
        images: [finalCloudinaryImageUrl],
        description,
        specs: ["Premium Luxury Material", "High-Stitch Count Tailoring", "Imported Craftsmanship Labels"],
        sizes: ["S", "M", "L", "XL"]
      })

      alert("SKU and Asset successfully deployed across dual cloud clusters! 🚀🎉")
      
      // Clear Form Fields on success
      setImageFile(null)
      setName("")
      setBrand("")
      setPrice("")
      setOriginalPrice("")
      setDescription("")
      
      // Reset the file input element visually
      const fileInput = document.getElementById("product-image-input") as HTMLInputElement
      if (fileInput) fileInput.value = ""

    } catch (err) {
      console.error("Integrated submission pipeline failed:", err)
      alert("Pipeline upload interrupted. Make sure your keys match exactly.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <form onSubmit={handleFormSubmission} className="max-w-lg mx-auto p-8 bg-white space-y-5 rounded-2xl shadow-xl border border-gray-100">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Orbit Luxury Vault Ingestion</h2>
          <p className="text-sm text-gray-500 mt-1">Simultaneous upload tracking across Cloudinary CDN assets & Firestore document records.</p>
        </div>
        
        <hr className="border-gray-200" />
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-600">Product Name</label>
            <input type="text" placeholder="e.g., Silk Weave Resort Polo" value={name} onChange={e => setName(e.target.value)} required className="w-full mt-1 p-3 border border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-600">Brand / Label Name</label>
            <input type="text" placeholder="e.g., Orbit Luxuries Collection" value={brand} onChange={e => setBrand(e.target.value)} required className="w-full mt-1 p-3 border border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-600">Listing Price (INR)</label>
              <input type="number" placeholder="4500" value={price} onChange={e => setPrice(e.target.value)} required className="w-full mt-1 p-3 border border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-600">Original MRP (INR)</label>
              <input type="number" placeholder="6000" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} required className="w-full mt-1 p-3 border border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-600">Product Brief Overview</label>
            <textarea rows={3} placeholder="Describe the fabrics, drapes, and premium silhouettes details..." value={description} onChange={e => setDescription(e.target.value)} className="w-full mt-1 p-3 border border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          
          {/* 📸 LOCAL HARDWARE IMAGE FILE GRABBER */}
          <div className="p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 hover:border-emerald-500 transition-colors">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Product Digital Asset Source</label>
            <input 
              id="product-image-input"
              type="file" 
              accept="image/*" 
              onChange={(e) => { if(e.target.files) setImageFile(e.target.files[0]) }} 
              required 
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-gray-900 file:text-white hover:file:bg-gray-800 cursor-pointer"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={uploading} 
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold tracking-wide rounded-xl transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md"
        >
          {uploading ? "Pumping Media Assets to Cloudinary Cloud Hub..." : "Commit SKU To Connected Pipeline"}
        </button>
      </form>
    </div>
  )
}