"use client"

import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useState, useMemo, useEffect } from "react"
import { useStore } from "@/context/store-context"
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Package,
  TrendingUp,
  Tag,
  AlertCircle,
  X,
  Check,
  ChevronDown,
  Grid3x3,
  List,
  ArrowUpDown,
  Upload,
  Loader2,
  Save,
  Image as ImageIcon,
  Camera,
  RefreshCw
} from "lucide-react"

// ✅ Default categories (fallback)
const DEFAULT_CATEGORIES = [
  "Fashion",
  "Footwear",
  "Accessories",
  "Home & Kitchen",
  "Beauty",
  "Gadgets",
  "Electronics",
  "Clothing",
  "Shoes",
  "Jewelry",
  "Watches",
  "Bags",
  "Perfumes",
  "Skincare"
]

export default function ProductsManagementPage() {
  const { products, addNewProduct, deleteProduct, updateProduct } = useStore() 
  
  // ✅ State for categories from Firestore
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES)
  const [loadingCategories, setLoadingCategories] = useState(false)
  
  // State for layout & filters
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [sortBy, setSortBy] = useState<"name" | "price" | "brand">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  
  const [viewingProduct, setViewingProduct] = useState<any | null>(null)
  const [editingProduct, setEditingProduct] = useState<any | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    originalPrice: "",
    description: "",
    specs: "",
  })
  
  // Upgraded Multi-Image & Sizes States
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [isAddingNewBrand, setIsAddingNewBrand] = useState(false)
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [uploading, setUploading] = useState(false)
  
  // Edit-specific states
  const [editImageFiles, setEditImageFiles] = useState<File[]>([])
  const [editExistingImages, setEditExistingImages] = useState<string[]>([])
  const [editSelectedSizes, setEditSelectedSizes] = useState<string[]>([])
  const [editIsAddingNewBrand, setEditIsAddingNewBrand] = useState(false)
  const [editIsAddingNewCategory, setEditIsAddingNewCategory] = useState(false)
  const [editNewCategoryName, setEditNewCategoryName] = useState("")
  const [editUploading, setEditUploading] = useState(false)
  const [editSpecs, setEditSpecs] = useState<string[]>([])
  const [editSpecInput, setEditSpecInput] = useState("")
  
  const standardSizes = ["XS", "S", "M", "L", "XL", "UK 7", "UK 8", "UK 9", "UK 10", "One Size"]

  // ✅ Load categories from Firestore on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true)
        console.log("🔍 Fetching categories from Firestore...")
        
        const categoriesRef = collection(db, "categories")
        const querySnapshot = await getDocs(categoriesRef)
        
        console.log("📄 Query snapshot size:", querySnapshot.size)
        
        const fetchedCategories: string[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          console.log("📄 Document:", doc.id, data)
          if (data.name) {
            fetchedCategories.push(data.name)
          }
        })
        
        console.log("✅ Fetched categories:", fetchedCategories)
        
        if (fetchedCategories.length > 0) {
          setCategories(fetchedCategories)
        } else {
          console.log("⚠️ No categories found in Firestore, using defaults")
          // If no categories in Firestore, create default ones
          await seedDefaultCategories()
        }
      } catch (error) {
        console.error("❌ Error fetching categories:", error)
        // Keep default categories if error
        setCategories(DEFAULT_CATEGORIES)
      } finally {
        setLoadingCategories(false)
      }
    }
    
    fetchCategories()
  }, [])

  // ✅ Seed default categories to Firestore
  const seedDefaultCategories = async () => {
    try {
      console.log("🌱 Seeding default categories to Firestore...")
      for (const categoryName of DEFAULT_CATEGORIES) {
        await addDoc(collection(db, "categories"), {
          name: categoryName,
          createdAt: new Date().toISOString()
        })
        console.log(`   ✅ Added category: ${categoryName}`)
      }
      setCategories(DEFAULT_CATEGORIES)
      console.log("✅ Seeded default categories to Firestore")
    } catch (error) {
      console.error("❌ Error seeding categories:", error)
    }
  }

  // ✅ Get categories from Firestore + product categories
  const availableCategories = useMemo(() => {
    const productCategories = [...new Set(products.map(p => p.category))].filter(Boolean)
    // Merge Firestore categories with product categories, remove duplicates
    const allCats = [...new Set([...productCategories, ...categories])].sort()
    console.log("📋 Available categories:", allCats)
    return allCats
  }, [categories, products])

  // Get unique brands from products
  const availableBrands = [...new Set(products.map(p => p.brand))].sort()

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === "" || product.category === filterCategory
      return matchesSearch && matchesCategory
    })

    filtered.sort((a, b) => {
      let comparison = 0
      if (sortBy === "name") comparison = a.name.localeCompare(b.name)
      else if (sortBy === "brand") comparison = a.brand.localeCompare(b.brand)
      else if (sortBy === "price") comparison = a.price - b.price
      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [products, searchTerm, filterCategory, sortBy, sortOrder])

  // Handle form input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value === "__new__") {
      setIsAddingNewBrand(true)
      setFormData({ ...formData, brand: "" })
    } else {
      setIsAddingNewBrand(false)
      setFormData({ ...formData, brand: value })
    }
  }

  // ✅ Handle category change with "Add New" option
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value === "__new__") {
      setIsAddingNewCategory(true)
      setFormData({ ...formData, category: "" })
    } else {
      setIsAddingNewCategory(false)
      setFormData({ ...formData, category: value })
    }
  }

  // ✅ Handle adding new category to Firestore
  const handleAddNewCategory = async () => {
    if (newCategoryName.trim()) {
      const categoryName = newCategoryName.trim()
      
      try {
        console.log(`➕ Adding new category: ${categoryName}`)
        // Save to Firestore
        await addDoc(collection(db, "categories"), {
          name: categoryName,
          createdAt: new Date().toISOString()
        })
        
        console.log(`✅ Category "${categoryName}" saved to Firestore`)
        
        // Update local state
        setCategories(prev => [...prev, categoryName])
        setFormData({ ...formData, category: categoryName })
        
        // Reset
        setNewCategoryName("")
        setIsAddingNewCategory(false)
        alert(`Category "${categoryName}" added successfully! 🎉`)
      } catch (error) {
        console.error("❌ Error adding category:", error)
        alert(`Failed to add category: ${error instanceof Error ? error.message : "Please try again."}`)
      }
    }
  }

  // Image handlers
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(prev => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeImage = (indexToRemove: number) => {
    setImageFiles(prev => prev.filter((_, index) => index !== indexToRemove))
  }

  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    )
  }

  // Edit handlers
  const handleEditImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setEditImageFiles(prev => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeEditImage = (indexToRemove: number) => {
    setEditImageFiles(prev => prev.filter((_, index) => index !== indexToRemove))
  }

  const removeExistingImage = (indexToRemove: number) => {
    setEditExistingImages(prev => prev.filter((_, index) => index !== indexToRemove))
  }

  const handleEditSizeToggle = (size: string) => {
    setEditSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    )
  }

  const handleEditBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value === "__new__") {
      setEditIsAddingNewBrand(true)
      setEditingProduct({ ...editingProduct, brand: "" })
    } else {
      setEditIsAddingNewBrand(false)
      setEditingProduct({ ...editingProduct, brand: value })
    }
  }

  // ✅ Handle edit category change with "Add New" option
  const handleEditCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value === "__new__") {
      setEditIsAddingNewCategory(true)
      setEditingProduct({ ...editingProduct, category: "" })
    } else {
      setEditIsAddingNewCategory(false)
      setEditingProduct({ ...editingProduct, category: value })
    }
  }

  // ✅ Handle adding new category in edit mode
  const handleEditAddNewCategory = async () => {
    if (editNewCategoryName.trim()) {
      const categoryName = editNewCategoryName.trim()
      
      try {
        console.log(`➕ Adding new category (edit mode): ${categoryName}`)
        // Save to Firestore
        await addDoc(collection(db, "categories"), {
          name: categoryName,
          createdAt: new Date().toISOString()
        })
        
        console.log(`✅ Category "${categoryName}" saved to Firestore`)
        
        // Update local state
        setCategories(prev => [...prev, categoryName])
        setEditingProduct({ ...editingProduct, category: categoryName })
        
        setEditNewCategoryName("")
        setEditIsAddingNewCategory(false)
        alert(`Category "${categoryName}" added successfully! 🎉`)
      } catch (error) {
        console.error("❌ Error adding category:", error)
        alert(`Failed to add category: ${error instanceof Error ? error.message : "Please try again."}`)
      }
    }
  }

  const addEditSpec = () => {
    if (editSpecInput.trim()) {
      setEditSpecs(prev => [...prev, editSpecInput.trim()])
      setEditSpecInput("")
    }
  }

  const removeEditSpec = (indexToRemove: number) => {
    setEditSpecs(prev => prev.filter((_, index) => index !== indexToRemove))
  }

  // Handle product submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.brand || !formData.category || !formData.price) {
      alert("Please fill in all required fields")
      return
    }

    if (imageFiles.length === 0) {
      alert("Please upload at least one product image.")
      return
    }
    
    try {
      setUploading(true)

      // Upload images to Cloudinary
      const uploadPromises = imageFiles.map(async (file) => {
        const cloudFormData = new FormData()
        cloudFormData.append("file", file)
        cloudFormData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: "POST", body: cloudFormData }
        )

        if (!response.ok) throw new Error("Image upload failed.")
        const data = await response.json()
        return data.secure_url
      })

      const secureUrls = await Promise.all(uploadPromises)
      
      const productData = {
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice) || Number(formData.price),
        image: secureUrls[0],
        images: secureUrls,
        description: formData.description,
        specs: formData.specs.split(",").map(s => s.trim()).filter(Boolean),
        sizes: selectedSizes.length > 0 ? selectedSizes : ["One Size"]
      }

      // ✅ Add product via store (updates local state)
      await addNewProduct(productData)
      
      alert("Success! Product permanently saved to Firebase.")
      
      // Clear your form states
      setFormData({
        name: "",
        brand: "",
        category: "",
        price: "",
        originalPrice: "",
        description: "",
        specs: ""
      })
      setImageFiles([])
      setSelectedSizes([])
      setIsAddingNewBrand(false)
      setIsAddingNewCategory(false)
      setNewCategoryName("")
      setShowForm(false)
      
    } catch (error) {
      console.error("Error adding product: ", error)
      alert("Failed to save product.")
    } finally {
      setUploading(false)
    }
  }

  // Enhanced edit handler with better debugging and product verification
  const handleEditClick = (product: any) => {
    console.log("Editing product:", product)
    
    // Verify the product exists in the current list
    const productExists = products.find(p => p.id === product.id)
    if (!productExists) {
      alert("This product no longer exists in the database. Please refresh the page.")
      return
    }
    
    setEditingProduct({
      ...product,
      name: product.name || "",
      brand: product.brand || "",
      category: product.category || "Fashion",
      price: product.price || 0,
      originalPrice: product.originalPrice || product.price || 0,
      description: product.description || "",
    })
    setEditExistingImages(product.images || [product.image].filter(Boolean))
    setEditImageFiles([])
    setEditSelectedSizes(product.sizes || ["One Size"])
    setEditSpecs(product.specs || [])
    setEditSpecInput("")
    setEditIsAddingNewBrand(false)
    setEditIsAddingNewCategory(false)
    setEditNewCategoryName("")
  }

  // Handle save edit with better error handling
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Validate required fields
      if (!editingProduct.name?.trim()) {
        alert("Product name is required")
        return
      }
      if (!editingProduct.brand?.trim()) {
        alert("Brand is required")
        return
      }
      if (!editingProduct.price || editingProduct.price <= 0) {
        alert("Valid price is required")
        return
      }

      // Check if we have at least one image (existing or new)
      if (editExistingImages.length === 0 && editImageFiles.length === 0) {
        alert("Please ensure at least one product image is available.")
        return
      }
      
      setEditUploading(true)

      // Verify the product exists before updating
      const productExists = products.find(p => p.id === editingProduct.id)
      if (!productExists) {
        alert(`Product with ID "${editingProduct.id}" no longer exists. Please refresh the page and try again.`)
        setEditUploading(false)
        // Close the edit modal
        setEditingProduct(null)
        setEditExistingImages([])
        setEditImageFiles([])
        setEditSelectedSizes([])
        setEditSpecs([])
        return
      }

      // Upload new images if any
      let newImageUrls: string[] = []
      if (editImageFiles.length > 0) {
        const uploadPromises = editImageFiles.map(async (file) => {
          const cloudFormData = new FormData()
          cloudFormData.append("file", file)
          cloudFormData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            { method: "POST", body: cloudFormData }
          )

          if (!response.ok) {
            throw new Error(`Image upload failed: ${response.statusText}`)
          }
          const data = await response.json()
          return data.secure_url
        })

        newImageUrls = await Promise.all(uploadPromises)
      }

      // Combine existing images with new ones
      const allImages = [...editExistingImages, ...newImageUrls]
      const mainImage = allImages[0] || editingProduct.image

      const updatedProductData = {
        name: editingProduct.name.trim(),
        brand: editingProduct.brand.trim(),
        category: editingProduct.category || "Fashion",
        price: parseFloat(editingProduct.price),
        originalPrice: parseFloat(editingProduct.originalPrice) || parseFloat(editingProduct.price),
        description: editingProduct.description || "",
        image: mainImage,
        images: allImages,
        specs: editSpecs.length > 0 ? editSpecs : ["Premium Quality"],
        sizes: editSelectedSizes.length > 0 ? editSelectedSizes : ["One Size"]
      }

      console.log("Saving updated product:", editingProduct.id, updatedProductData)

      // Make sure updateProduct exists and is called correctly
      if (!updateProduct) {
        throw new Error("updateProduct function is not available")
      }

      // Use the product ID directly from the editingProduct
      await updateProduct(editingProduct.id, updatedProductData)
      
      // Reset edit state
      setEditingProduct(null)
      setEditExistingImages([])
      setEditImageFiles([])
      setEditSelectedSizes([])
      setEditSpecs([])
      
      alert("Product updated successfully! ✅")
    } catch (error: any) {
      console.error("Update Error:", error)
      
      // Specific error handling for "No document to update"
      if (error.message && error.message.includes("No document to update")) {
        alert(`The product "${editingProduct?.name}" no longer exists in the database. It may have been deleted. Please refresh the page.`)
        // Close the edit modal
        setEditingProduct(null)
        setEditExistingImages([])
        setEditImageFiles([])
        setEditSelectedSizes([])
        setEditSpecs([])
      } else {
        alert(`Failed to update product: ${error.message || "Please try again."}`)
      }
    } finally {
      setEditUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      try {
        await deleteProduct(id)
        alert("Product deleted successfully! 🗑️")
      } catch (error) {
        alert("Failed to delete product. Please try again.")
        console.error("Delete error:", error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <Package className="w-7 h-7 text-[#c9a84c]" />
              Product Catalog
              <span className="text-sm font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                {products.length} items
              </span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage your luxury product inventory</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
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
                Add Product
              </>
            )}
          </button>
        </div>

        {/* Product Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 animate-slide-down">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#c9a84c]" />
                Add New Product
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 border-0 bg-transparent cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-800 block mb-1">
                    PRODUCT NAME *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Premium Silk Resort Shirt"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-800 block mb-1">
                    BRAND *
                  </label>
                  <select
                    name="brand"
                    value={isAddingNewBrand ? "__new__" : formData.brand}
                    onChange={handleBrandChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent"
                    required
                  >
                    <option value="">Select a brand...</option>
                    {availableBrands.map((brand) => (
                      <option key={brand as string} value={brand as string}>{brand as string}</option>
                    ))}
                    <option value="__new__" className="text-[#c9a84c]">➕ Add New Brand</option>
                  </select>
                  
                  {isAddingNewBrand && (
                    <input
                      type="text"
                      placeholder="Enter new brand name"
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full mt-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent"
                      autoFocus
                    />
                  )}
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-800 block mb-1">
                    CATEGORY *
                  </label>
                  <select
                    name="category"
                    value={isAddingNewCategory ? "__new__" : formData.category}
                    onChange={handleCategoryChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent"
                    required
                  >
                    <option value="">Select category...</option>
                    {availableCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="__new__" className="text-[#c9a84c]">➕ Add New Category</option>
                  </select>
                  
                  {isAddingNewCategory && (
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="Enter new category name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleAddNewCategory}
                        className="px-4 py-2.5 bg-[#c9a84c] text-[#1a1a2e] rounded-xl text-sm font-medium hover:bg-[#d4b85c] transition-colors border-0 cursor-pointer"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingNewCategory(false)
                          setNewCategoryName("")
                        }}
                        className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-300 transition-colors border-0 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-gray-800 block mb-1">
                      PRICE (₹) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="12500"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-800 block mb-1">
                      ORIGINAL PRICE
                    </label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      placeholder="18000"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-800 flex justify-between mb-1">
                    <span>IMAGE URL *</span>
                    <span className="text-gray-500 font-normal">{imageFiles.length} selected</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={handleImageSelect}
                      className="absolute inset-0 w-full h-32 opacity-0 cursor-pointer z-10"
                    />
                    <div className="h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-center bg-gray-50/50 hover:border-[#c9a84c] transition-all">
                      <Upload className="w-6 h-6 text-gray-500 mb-2" />
                      <p className="text-sm font-medium text-gray-700">Click or drag to upload multiple images</p>
                      <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                    </div>
                  </div>

                  {imageFiles.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-4">
                      {imageFiles.map((file, idx) => (
                        <div key={idx} className="relative w-20 h-24 rounded-lg border border-gray-200 overflow-hidden group bg-gray-100">
                          <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="" />
                          <button 
                            type="button" 
                            onClick={() => removeImage(idx)} 
                            className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-red-500 shadow-md opacity-0 group-hover:opacity-100 transition-opacity border-0 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-800 block mb-1">
                    DESCRIPTION
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Product description..."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-800 block mb-1">
                    SPECIFICATIONS
                  </label>
                  <input
                    type="text"
                    name="specs"
                    value={formData.specs}
                    onChange={handleInputChange}
                    placeholder="100% Cotton, Premium Quality, Made in India"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-800 block mb-2">
                    AVAILABLE SIZES
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {standardSizes.map((size) => (
                      <button
                        type="button"
                        key={size}
                        onClick={() => handleSizeToggle(size)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer outline-none ${
                          selectedSizes.includes(size)
                            ? "bg-[#1a1a2e] text-white border-[#1a1a2e]"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full py-3 bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#1a1a2e]/20 transition-all duration-300 flex items-center justify-center gap-2 border-0 cursor-pointer disabled:opacity-50"
                >
                  {uploading ? (
                    <><Loader2 className="w-5 h-5 animate-spin text-[#c9a84c]" /> Uploading...</>
                  ) : (
                    <><Plus className="w-4 h-4" /> Add to Catalog</>
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
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent"
            >
              <option value="">All Categories</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="brand">Sort by Brand</option>
              <option value="price">Sort by Price</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2 border-0 cursor-pointer"
            >
              <ArrowUpDown className="w-4 h-4" />
              {sortOrder === "asc" ? "A-Z" : "Z-A"}
            </button>

            <div className="flex items-center gap-1 ml-auto">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors border-0 cursor-pointer ${
                  viewMode === "grid" ? "bg-[#c9a84c] text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors border-0 cursor-pointer ${
                  viewMode === "list" ? "bg-[#c9a84c] text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Package className="w-16 h-16 text-gray-300 mx-auto" />
            <h3 className="text-lg font-semibold text-gray-600 mt-4">No products found</h3>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          viewMode === "list" ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Brand</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Sizes</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-12 h-12 rounded-xl object-cover bg-gray-100"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{product.name}</p>
                              <p className="text-xs text-gray-500 truncate max-w-[200px]">{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-700">{product.brand}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-bold text-gray-900">₹{product.price.toLocaleString()}</p>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <p className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {product.sizes?.slice(0, 3).map((size: string) => (
                              <span key={size} className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                {size}
                              </span>
                            ))}
                            {product.sizes && product.sizes.length > 3 && (
                              <span className="text-[10px] font-medium text-gray-400">+{product.sizes.length - 3}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => setViewingProduct(product)}
                              className="p-2 text-gray-400 hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 rounded-lg transition-colors border-0 bg-transparent cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEditClick(product)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border-0 bg-transparent cursor-pointer"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(product.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border-0 bg-transparent cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setViewingProduct(product)}
                        className="p-2 bg-white rounded-xl shadow-lg hover:bg-[#c9a84c] hover:text-white transition-colors border-0 cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditClick(product)}
                        className="p-2 bg-white rounded-xl shadow-lg hover:bg-blue-600 hover:text-white transition-colors border-0 cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 bg-white rounded-xl shadow-lg hover:bg-red-600 hover:text-white transition-colors border-0 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{product.name}</h3>
                    <p className="text-xs text-gray-500">{product.brand}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <p className="text-sm font-bold text-gray-900">₹{product.price.toLocaleString()}</p>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <p className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</p>
                        )}
                      </div>
                      <span className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {product.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Footer Stats */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100/50 p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-[#c9a84c]" />
              <span className="text-sm text-gray-600">
                Total: <strong className="text-gray-900">{filteredProducts.length}</strong> products
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#c9a84c]" />
              <span className="text-sm text-gray-600">
                {availableCategories.length} categories
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Check className="w-4 h-4 text-emerald-500" />
            All products are live
          </div>
        </div>
      </div>

      {/* View Modal */}
      {viewingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex overflow-hidden animate-slide-up">
            <div className="w-2/5 bg-gray-100">
              <img src={viewingProduct.image} className="w-full h-full object-cover" alt="Product" />
            </div>
            <div className="w-3/5 p-8 relative">
              <button onClick={() => setViewingProduct(null)} className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full cursor-pointer border-0">
                <X className="w-4 h-4" />
              </button>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#c9a84c] mb-1 block">
                {viewingProduct.brand}
              </span>
              <h2 className="text-2xl font-black text-gray-900 leading-tight mb-2">
                {viewingProduct.name}
              </h2>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xl font-bold text-gray-900">₹{Number(viewingProduct.price).toLocaleString()}</span>
                {viewingProduct.originalPrice > viewingProduct.price && (
                  <span className="text-sm text-gray-400 line-through">₹{Number(viewingProduct.originalPrice).toLocaleString()}</span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-6">
                {viewingProduct.description || "No description provided for this item."}
              </p>
              
              <div className="mb-4">
                <p className="text-xs font-bold uppercase text-gray-400 mb-2">Available Sizes</p>
                <div className="flex flex-wrap gap-2">
                  {(viewingProduct.sizes || ["One Size"]).map((s: string) => (
                    <span key={s} className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-bold rounded">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white z-10 px-8 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Edit className="w-5 h-5 text-[#c9a84c]" />
                  Edit Product
                </h2>
                <p className="text-sm text-gray-500">Update product details, images, and specifications</p>
              </div>
              <button 
                onClick={() => {
                  setEditingProduct(null)
                  setEditExistingImages([])
                  setEditImageFiles([])
                  setEditSelectedSizes([])
                  setEditSpecs([])
                }} 
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full cursor-pointer border-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Images */}
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-bold text-gray-800 mb-3 block">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Product Images
                      </div>
                      <span className="text-xs font-normal text-gray-500 mt-1 block">
                        {editExistingImages.length + editImageFiles.length} images total
                      </span>
                    </label>
                    
                    {/* Existing Images */}
                    {editExistingImages.length > 0 && (
                      <div className="flex flex-wrap gap-3 mb-4">
                        {editExistingImages.map((url, idx) => (
                          <div key={`existing-${idx}`} className="relative w-24 h-24 rounded-xl border-2 border-gray-200 overflow-hidden group bg-gray-100">
                            <img src={url} className="w-full h-full object-cover" alt={`Product ${idx + 1}`} />
                            <button 
                              type="button"
                              onClick={() => removeExistingImage(idx)}
                              className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity border-0 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            {idx === 0 && (
                              <span className="absolute bottom-1 left-1 bg-[#c9a84c] text-[#1a1a2e] text-[8px] font-bold px-2 py-0.5 rounded">
                                MAIN
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* New Images */}
                    {editImageFiles.length > 0 && (
                      <div className="flex flex-wrap gap-3 mb-4">
                        {editImageFiles.map((file, idx) => (
                          <div key={`new-${idx}`} className="relative w-24 h-24 rounded-xl border-2 border-blue-200 overflow-hidden group bg-gray-100">
                            <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt={`New ${idx + 1}`} />
                            <button 
                              type="button"
                              onClick={() => removeEditImage(idx)}
                              className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity border-0 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-[8px] font-bold px-2 py-0.5 rounded">
                              NEW
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        onChange={handleEditImageSelect}
                        className="absolute inset-0 w-full h-28 opacity-0 cursor-pointer z-10"
                      />
                      <div className="h-28 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-center bg-gray-50/50 hover:border-[#c9a84c] transition-all">
                        <Camera className="w-5 h-5 text-gray-500 mb-1" />
                        <p className="text-xs font-medium text-gray-700">Add more images</p>
                        <p className="text-[10px] text-gray-500">PNG, JPG up to 10MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Sizes */}
                  <div>
                    <label className="text-sm font-bold text-gray-800 mb-3 block">Available Sizes</label>
                    <div className="flex flex-wrap gap-2">
                      {standardSizes.map((size) => (
                        <button
                          type="button"
                          key={size}
                          onClick={() => handleEditSizeToggle(size)}
                          className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer outline-none ${
                            editSelectedSizes.includes(size)
                              ? "bg-[#1a1a2e] text-white border-[#1a1a2e]"
                              : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Product Details */}
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-bold text-gray-800 mb-1 block">Product Name *</label>
                    <input 
                      type="text" 
                      value={editingProduct.name || ""} 
                      onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} 
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 transition-all" 
                      required 
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-gray-800 mb-1 block">Brand *</label>
                    <select
                      value={editIsAddingNewBrand ? "__new__" : (editingProduct.brand || "")}
                      onChange={handleEditBrandChange}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 transition-all"
                      required
                    >
                      <option value="">Select a brand...</option>
                      {availableBrands.map((brand) => (
                        <option key={brand as string} value={brand as string}>{brand as string}</option>
                      ))}
                      <option value="__new__" className="text-[#c9a84c]">➕ Add New Brand</option>
                    </select>
                    
                    {editIsAddingNewBrand && (
                      <input
                        type="text"
                        placeholder="Enter new brand name"
                        value={editingProduct.brand || ""}
                        onChange={(e) => setEditingProduct({...editingProduct, brand: e.target.value})}
                        className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 transition-all"
                        autoFocus
                      />
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-bold text-gray-800 mb-1 block">Category</label>
                    <select
                      value={editIsAddingNewCategory ? "__new__" : (editingProduct.category || "Fashion")}
                      onChange={handleEditCategoryChange}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 transition-all"
                    >
                      <option value="">Select category...</option>
                      {availableCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="__new__" className="text-[#c9a84c]">➕ Add New Category</option>
                    </select>
                    
                    {editIsAddingNewCategory && (
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          placeholder="Enter new category name"
                          value={editNewCategoryName}
                          onChange={(e) => setEditNewCategoryName(e.target.value)}
                          className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 transition-all"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={handleEditAddNewCategory}
                          className="px-4 py-2 bg-[#c9a84c] text-[#1a1a2e] rounded-xl text-sm font-medium hover:bg-[#d4b85c] transition-colors border-0 cursor-pointer"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditIsAddingNewCategory(false)
                            setEditNewCategoryName("")
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-300 transition-colors border-0 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold text-gray-800 mb-1 block">Price (₹) *</label>
                      <input 
                        type="number" 
                        value={editingProduct.price || 0} 
                        onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})} 
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 transition-all" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-800 mb-1 block">Strike Price</label>
                      <input 
                        type="number" 
                        value={editingProduct.originalPrice || 0} 
                        onChange={(e) => setEditingProduct({...editingProduct, originalPrice: e.target.value})} 
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 transition-all" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-gray-800 mb-1 block">Description</label>
                    <textarea 
                      value={editingProduct.description || ""} 
                      onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})} 
                      rows={2} 
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 transition-all resize-none" 
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-gray-800 mb-1 block">Specifications</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={editSpecInput}
                        onChange={(e) => setEditSpecInput(e.target.value)}
                        placeholder="Add spec (e.g., 100% Cotton)"
                        className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 transition-all"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEditSpec())}
                      />
                      <button
                        type="button"
                        onClick={addEditSpec}
                        className="px-4 py-2 bg-[#c9a84c] text-[#1a1a2e] rounded-xl font-medium hover:bg-[#d4b85c] transition-colors border-0 cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                    {editSpecs.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {editSpecs.map((spec, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg">
                            {spec}
                            <button
                              type="button"
                              onClick={() => removeEditSpec(idx)}
                              className="text-gray-400 hover:text-red-500 border-0 bg-transparent cursor-pointer p-0"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null)
                    setEditExistingImages([])
                    setEditImageFiles([])
                    setEditSelectedSizes([])
                    setEditSpecs([])
                  }}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors border-0 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editUploading}
                  className="flex-1 py-3 bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#1a1a2e]/20 transition-all duration-300 flex items-center justify-center gap-2 border-0 cursor-pointer disabled:opacity-50"
                >
                  {editUploading ? (
                    <><Loader2 className="w-5 h-5 animate-spin text-[#c9a84c]" /> Saving...</>
                  ) : (
                    <><Save className="w-4 h-4" /> Save Changes</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}