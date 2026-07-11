"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import { useStore } from "@/context/store-context"

export default function AdminBrandDetailPage() {
  const { brandName } = useParams()
  const { products } = useStore()
  
  const [brandSettings, setBrandSettings] = useState({
    name: typeof brandName === 'string' ? brandName.replace(/-/g, ' ').toUpperCase() : '',
    status: 'active',
    logo: '',
    description: ''
  })

  // Filter products by this brand
  const brandProducts = products.filter(p => 
    p.brand?.toLowerCase() === (typeof brandName === 'string' ? brandName.replace(/-/g, ' ') : '')
  )

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Brand Management: {brandSettings.name}</h1>
      
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="border rounded-lg p-4">
          <h2 className="font-semibold mb-3">Brand Settings</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Brand Name</label>
              <input 
                type="text" 
                value={brandSettings.name}
                onChange={(e) => setBrandSettings({...brandSettings, name: e.target.value})}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Status</label>
              <select 
                value={brandSettings.status}
                onChange={(e) => setBrandSettings({...brandSettings, status: e.target.value})}
                className="w-full border rounded px-3 py-2"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <button className="bg-[#DA1C5C] text-white px-4 py-2 rounded hover:bg-[#b8144a]">
              Save Brand Settings
            </button>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="font-semibold mb-3">Brand Statistics</h2>
          <p>Total Products: {brandProducts.length}</p>
          <Link href={`/admin/products?brand=${brandName}`} className="text-[#DA1C5C] text-sm mt-2 inline-block">
            View All Products →
          </Link>
        </div>
      </div>
      
      <div className="border rounded-lg p-4">
        <h2 className="font-semibold mb-3">Products under this brand</h2>
        <div className="space-y-2">
          {brandProducts.map((product) => (
            <div key={product.id} className="flex justify-between items-center p-2 border-b">
              <span>{product.name}</span>
              <Link href={`/admin/products/${product.id}`} className="text-blue-500 text-sm">
                Edit
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}