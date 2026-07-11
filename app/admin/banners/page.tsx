"use client"

import React, { useState, useEffect } from "react"
import { useStore } from "@/context/store-context"
import { 
  Image, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  X,
  Upload,
  Loader2,
  Calendar,
  Tag,
  Link as LinkIcon,
  AlertCircle,
  Check,
  Clock,
  ArrowUpDown,
  Download,
  RefreshCw
} from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, Timestamp } from "firebase/firestore"

interface Banner {
  id: string
  title: string
  subtitle: string
  image: string
  link: string
  position: "hero" | "featured" | "sidebar" | "footer"
  isActive: boolean
  priority: number
  startDate?: string
  endDate?: string
  createdAt: string
  updatedAt?: string
}

// Firestore data type (without id and with Timestamp)
interface BannerFirestoreData {
  title: string
  subtitle: string
  image: string
  link: string
  position: "hero" | "featured" | "sidebar" | "footer"
  isActive: boolean
  priority: number
  startDate: string | null
  endDate: string | null
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export default function AdminBannersPage() {
  const { user } = useStore()
  
  // State
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [positionFilter, setPositionFilter] = useState<string>("")
  const [sortBy, setSortBy] = useState<"createdAt" | "priority" | "title">("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: "",
    link: "",
    position: "hero" as Banner["position"],
    isActive: true,
    priority: 1,
    startDate: "",
    endDate: ""
  })

  // Upload state
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Fetch banners
  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      setLoading(true)
      const querySnapshot = await getDocs(collection(db, "banners"))
      const bannerData: Banner[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        bannerData.push({
          id: doc.id,
          title: data.title || "",
          subtitle: data.subtitle || "",
          image: data.image || "",
          link: data.link || "",
          position: data.position || "hero",
          isActive: data.isActive ?? true,
          priority: data.priority || 0,
          startDate: data.startDate || "",
          endDate: data.endDate || "",
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || ""
        })
      })
      // Sort by priority by default
      bannerData.sort((a, b) => (a.priority || 0) - (b.priority || 0))
      setBanners(bannerData)
    } catch (err) {
      console.error("Error fetching banners:", err)
      // If collection doesn't exist, use sample data
      setBanners(getSampleBanners())
    } finally {
      setLoading(false)
    }
  }

  // Sample banners for demo
  const getSampleBanners = (): Banner[] => {
    return [
      {
        id: "banner-1",
        title: "Summer Collection 2026",
        subtitle: "Discover the latest trends in luxury fashion",
        image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&auto=format&fit=crop&q=80",
        link: "/collections/summer",
        position: "hero",
        isActive: true,
        priority: 1,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString()
      },
      {
        id: "banner-2",
        title: "Premium Accessories",
        subtitle: "Elevate your style with our curated collection",
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80",
        link: "/collections/accessories",
        position: "featured",
        isActive: true,
        priority: 2,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString()
      },
      {
        id: "banner-3",
        title: "Exclusive Footwear",
        subtitle: "Step into luxury with our premium shoes",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80",
        link: "/collections/footwear",
        position: "sidebar",
        isActive: true,
        priority: 3,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString()
      }
    ]
  }

  // Filter and sort banners
  const filteredBanners = React.useMemo(() => {
    let filtered = banners.filter(banner => {
      const matchesSearch = 
        banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        banner.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPosition = positionFilter === "" || banner.position === positionFilter
      return matchesSearch && matchesPosition
    })

    filtered.sort((a, b) => {
      let comparison = 0
      if (sortBy === "title") {
        comparison = a.title.localeCompare(b.title)
      } else if (sortBy === "priority") {
        comparison = (a.priority || 0) - (b.priority || 0)
      } else {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        comparison = dateA - dateB
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [banners, searchTerm, positionFilter, sortBy, sortOrder])

  // Handle form input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    })
  }

  // Handle image upload to Cloudinary
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      setUploadProgress(0)

      const cloudFormData = new FormData()
      cloudFormData.append("file", file)
      cloudFormData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: cloudFormData }
      )

      if (!response.ok) throw new Error("Image upload failed.")
      
      const data = await response.json()
      setFormData({ ...formData, image: data.secure_url })
      setUploadProgress(100)
      
      alert("Image uploaded successfully! 📸")
    } catch (err) {
      console.error("Upload Error:", err)
      alert("Failed to upload image. Please try again.")
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.image) {
      alert("Please fill in all required fields")
      return
    }

    try {
      // Create clean data object with proper type assertion
      const bannerData: BannerFirestoreData = {
        title: formData.title,
        subtitle: formData.subtitle || "",
        image: formData.image,
        link: formData.link || "",
        position: formData.position,
        isActive: formData.isActive,
        priority: Number(formData.priority),
        startDate: formData.startDate || null,
        endDate: formData.endDate || null
      }

      if (editingBanner) {
        // Update existing banner
        const docRef = doc(db, "banners", editingBanner.id)
        await updateDoc(docRef, {
          ...bannerData,
          updatedAt: serverTimestamp()
        })
        
        // Update local state with the new data
        const updatedBanner: Banner = {
          id: editingBanner.id,
          title: bannerData.title,
          subtitle: bannerData.subtitle,
          image: bannerData.image,
          link: bannerData.link,
          position: bannerData.position,
          isActive: bannerData.isActive,
          priority: bannerData.priority,
          startDate: bannerData.startDate || undefined,
          endDate: bannerData.endDate || undefined,
          createdAt: editingBanner.createdAt,
          updatedAt: new Date().toISOString()
        }
        
        setBanners(prev => 
          prev.map(b => b.id === editingBanner.id ? updatedBanner : b)
        )
        alert("Banner updated successfully! 🎉")
      } else {
        // Add new banner
        const docRef = await addDoc(collection(db, "banners"), {
          ...bannerData,
          createdAt: serverTimestamp()
        })
        
        const newBanner: Banner = {
          id: docRef.id,
          title: bannerData.title,
          subtitle: bannerData.subtitle,
          image: bannerData.image,
          link: bannerData.link,
          position: bannerData.position,
          isActive: bannerData.isActive,
          priority: bannerData.priority,
          startDate: bannerData.startDate || undefined,
          endDate: bannerData.endDate || undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setBanners(prev => [...prev, newBanner])
        alert("Banner added successfully! 🎉")
      }

      // Reset form
      setFormData({
        title: "",
        subtitle: "",
        image: "",
        link: "",
        position: "hero",
        isActive: true,
        priority: 1,
        startDate: "",
        endDate: ""
      })
      setEditingBanner(null)
      setShowForm(false)
    } catch (err) {
      console.error("Error saving banner:", err)
      alert("Failed to save banner. Please try again.")
    }
  }

  // Handle delete
  const handleDelete = async (bannerId: string) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return
    
    try {
      await deleteDoc(doc(db, "banners", bannerId))
      setBanners(prev => prev.filter(b => b.id !== bannerId))
      alert("Banner deleted successfully! 🗑️")
    } catch (err) {
      console.error("Error deleting banner:", err)
      alert("Failed to delete banner. Please try again.")
    }
  }

  // Handle edit
  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || "",
      image: banner.image,
      link: banner.link || "",
      position: banner.position,
      isActive: banner.isActive,
      priority: banner.priority || 1,
      startDate: banner.startDate || "",
      endDate: banner.endDate || ""
    })
    setShowForm(true)
  }

  // Get position badge
  const PositionBadge = ({ position }: { position: Banner["position"] }) => {
    const colors = {
      hero: "bg-purple-100 text-purple-700",
      featured: "bg-blue-100 text-blue-700",
      sidebar: "bg-green-100 text-green-700",
      footer: "bg-gray-100 text-gray-700"
    }
    return (
      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${colors[position]}`}>
        {position.charAt(0).toUpperCase() + position.slice(1)}
      </span>
    )
  }

  // Stats
  const stats = React.useMemo(() => {
    const total = banners.length
    const active = banners.filter(b => b.isActive).length
    const inactive = total - active
    const hero = banners.filter(b => b.position === "hero").length
    return { total, active, inactive, hero }
  }, [banners])

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <Image className="w-7 h-7 text-[#c9a84c]" />
              Banner Management
              <span className="text-sm font-medium bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                {banners.length} banners
              </span>
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {stats.active} active • {stats.inactive} inactive • {stats.hero} hero banners
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingBanner(null)
                setFormData({
                  title: "",
                  subtitle: "",
                  image: "",
                  link: "",
                  position: "hero",
                  isActive: true,
                  priority: 1,
                  startDate: "",
                  endDate: ""
                })
                setShowForm(!showForm)
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#1a1a2e]/20 transition-all duration-300 border-0 cursor-pointer"
            >
              {showForm ? (
                <>
                  <X className="w-4 h-4" />
                  Close Form
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Banner
                </>
              )}
            </button>
            <button 
              onClick={fetchBanners}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors border-0 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Banner Form - FIXED: All labels now visible */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 animate-slide-down">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                {editingBanner ? (
                  <>
                    <Edit className="w-5 h-5 text-[#c9a84c]" />
                    Edit Banner
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 text-[#c9a84c]" />
                    Add New Banner
                  </>
                )}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 border-0 bg-transparent cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-800 block mb-1">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Summer Collection 2026"
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-800 block mb-1">Subtitle</label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    placeholder="e.g., Discover the latest trends"
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-800 block mb-1">Link URL</label>
                  <input
                    type="text"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    placeholder="e.g., /collections/summer"
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-800 block mb-1">Position</label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent"
                  >
                    <option value="hero">Hero (Main Banner)</option>
                    <option value="featured">Featured</option>
                    <option value="sidebar">Sidebar</option>
                    <option value="footer">Footer</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-800 block mb-1">Banner Image *</label>
                  <div className="relative mt-1">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-32 opacity-0 cursor-pointer z-10"
                      disabled={uploading}
                    />
                    <div className={`h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-center bg-gray-50/50 hover:border-[#c9a84c] transition-all ${uploading ? 'opacity-50' : ''}`}>
                      {uploading ? (
                        <div className="flex flex-col items-center">
                          <Loader2 className="w-6 h-6 text-[#c9a84c] animate-spin" />
                          <p className="text-sm font-medium text-gray-700 mt-2">Uploading... {uploadProgress}%</p>
                        </div>
                      ) : formData.image ? (
                        <div className="relative w-full h-full">
                          <img 
                            src={formData.image} 
                            alt="Banner preview" 
                            className="w-full h-full object-contain rounded-xl"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, image: "" })}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors border-0 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-gray-500 mb-2" />
                          <p className="text-sm font-medium text-gray-700">Click to upload banner image</p>
                          <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-800 block mb-1">Priority</label>
                  <input
                    type="number"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-gray-800 block mb-1">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-800 block mb-1">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-gray-300 text-[#c9a84c] focus:ring-[#c9a84c]"
                  />
                  <label className="text-sm font-medium text-gray-700">Banner is active</label>
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full py-3 bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#1a1a2e]/20 transition-all duration-300 disabled:opacity-50 border-0 cursor-pointer"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 inline animate-spin mr-2" />
                      Uploading...
                    </>
                  ) : editingBanner ? (
                    <>
                      <Edit className="w-4 h-4 inline mr-2" />
                      Update Banner
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 inline mr-2" />
                      Create Banner
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search banners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent"
              />
            </div>

            <select
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent"
            >
              <option value="">All Positions</option>
              <option value="hero">Hero</option>
              <option value="featured">Featured</option>
              <option value="sidebar">Sidebar</option>
              <option value="footer">Footer</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent"
            >
              <option value="createdAt">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="priority">Sort by Priority</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2 border-0 cursor-pointer"
            >
              <ArrowUpDown className="w-4 h-4" />
              {sortOrder === "asc" ? "Oldest" : "Newest"}
            </button>
          </div>
        </div>

        {/* Banner Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-[#c9a84c] animate-spin" />
          </div>
        ) : filteredBanners.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Image className="w-16 h-16 text-gray-300 mx-auto" />
            <h3 className="text-lg font-semibold text-gray-700 mt-4">No banners found</h3>
            <p className="text-sm text-gray-500 mt-1">Create your first banner to start promoting</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBanners.map((banner) => (
              <div 
                key={banner.id} 
                className="group bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                  <img 
                    src={banner.image} 
                    alt={banner.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEdit(banner)}
                      className="p-2 bg-white rounded-xl shadow-lg hover:bg-blue-50 transition-colors border-0 cursor-pointer"
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                    </button>
                    <button 
                      onClick={() => handleDelete(banner.id)}
                      className="p-2 bg-white rounded-xl shadow-lg hover:bg-red-50 transition-colors border-0 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                  {!banner.isActive && (
                    <div className="absolute top-3 left-3 bg-gray-900/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-lg">
                      Inactive
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{banner.title}</h3>
                    <PositionBadge position={banner.position} />
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{banner.subtitle}</p>
                  
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                    {banner.link && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <LinkIcon className="w-3 h-3" />
                        {banner.link}
                      </span>
                    )}
                    <span className="text-xs text-gray-500 flex items-center gap-1 ml-auto">
                      <Clock className="w-3 h-3" />
                      Priority: {banner.priority || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100/50 p-4 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            Showing <strong className="text-gray-900">{filteredBanners.length}</strong> of <strong className="text-gray-900">{banners.length}</strong> banners
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Image className="w-4 h-4 text-[#c9a84c]" />
            <span>{stats.active} active • {stats.inactive} inactive</span>
          </div>
        </div>
      </div>
    </div>
  )
}