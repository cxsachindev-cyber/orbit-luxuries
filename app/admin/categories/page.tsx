"use client"

import React, { useState, useMemo, useEffect } from "react"
import { useStore } from "@/context/store-context"
import { 
  Layers, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  FolderTree,
  FolderOpen,
  FolderPlus,
  ChevronRight,
  ChevronDown,
  Grid3x3,
  List,
  Tag,
  Package,
  ShoppingBag,
  Sparkles,
  Eye,
  ArrowUpDown,
  X,
  Check,
  AlertCircle,
  Upload,
  Download,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
  productCount: number
  subcategories: Category[]
  isActive: boolean
  createdAt: Date
}

export default function AdminCategoriesPanel() {
  const { products } = useStore()
  
  // State
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  
  // State for viewing products in a category
  const [viewingCategoryProducts, setViewingCategoryProducts] = useState<any[]>([])
  const [showCategoryProducts, setShowCategoryProducts] = useState(false)
  const [currentCategoryName, setCurrentCategoryName] = useState("")
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "📁",
    color: "#c9a84c",
    isActive: true,
    parentId: ""
  })

  // DYNAMIC: Build categories from actual products
  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = Array.from(new Set(products.map(p => p.category))).filter(Boolean)
      
      const dynamicCategories: Category[] = uniqueCategories.map((categoryName, index) => {
        const productCount = products.filter(p => p.category === categoryName).length
        
        return {
          id: `cat-${index + 1}`,
          name: categoryName as string,
          slug: (categoryName as string).toLowerCase().replace(/\s+/g, '-'),
          description: `${categoryName} products collection`,
          icon: getCategoryIcon(categoryName as string),
          color: getCategoryColor(categoryName as string),
          productCount: productCount,
          isActive: true,
          createdAt: new Date(),
          subcategories: []
        }
      })
      
      setCategories(dynamicCategories)
    }
  }, [products])

  // Helper: Get icon based on category name
  const getCategoryIcon = (categoryName: string): string => {
    const iconMap: Record<string, string> = {
      'Fashion': '👗',
      'Footwear': '👟',
      'Accessories': '⌚',
      'Home & Kitchen': '🏠',
      'Beauty': '💄',
      'Gadgets': '📱',
      'Electronics': '📱',
      'Clothing': '👔',
      'Shoes': '👞',
      'Jewelry': '💍',
      'Watches': '⌚',
      'Bags': '👜',
      'Perfumes': '🧴',
      'Skincare': '🧴',
      'Makeup': '💄'
    }
    return iconMap[categoryName] || '📁'
  }

  // Helper: Get color based on category name
  const getCategoryColor = (categoryName: string): string => {
    const colorMap: Record<string, string> = {
      'Fashion': '#e74c3c',
      'Footwear': '#2c3e50',
      'Accessories': '#f1c40f',
      'Home & Kitchen': '#27ae60',
      'Beauty': '#e91e63',
      'Gadgets': '#2980b9',
      'Electronics': '#2980b9',
      'Clothing': '#3498db',
      'Shoes': '#34495e',
      'Jewelry': '#f39c12',
      'Watches': '#95a5a6',
      'Bags': '#8e44ad',
      'Perfumes': '#e67e22',
      'Skincare': '#1abc9c',
      'Makeup': '#e91e63'
    }
    return colorMap[categoryName] || '#c9a84c'
  }

  // Filter categories
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories
    const search = searchTerm.toLowerCase()
    return categories.filter(cat => 
      cat.name.toLowerCase().includes(search) ||
      cat.description.toLowerCase().includes(search)
    )
  }, [categories, searchTerm])

  // Get accurate product count for category
  const getProductCount = (categoryName: string) => {
    return products.filter(p => p.category === categoryName).length
  }

  // Get all products in a category
  const getProductsInCategory = (categoryName: string) => {
    return products.filter(p => p.category === categoryName)
  }

  // View products in a category
  const handleViewCategoryProducts = (categoryName: string) => {
    const categoryProducts = getProductsInCategory(categoryName)
    setCurrentCategoryName(categoryName)
    setViewingCategoryProducts(categoryProducts)
    setShowCategoryProducts(true)
  }

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  // Handle form input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    })
  }

  // Handle submit - Add custom category
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.slug) {
      alert("Please fill in all required fields")
      return
    }

    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      icon: formData.icon,
      color: formData.color,
      productCount: 0,
      isActive: formData.isActive,
      createdAt: new Date(),
      subcategories: []
    }

    if (editingCategory) {
      setCategories(prev => 
        prev.map(cat => cat.id === editingCategory.id ? { ...cat, ...newCategory } : cat)
      )
    } else {
      setCategories(prev => [...prev, newCategory])
    }

    setFormData({
      name: "",
      slug: "",
      description: "",
      icon: "📁",
      color: "#c9a84c",
      isActive: true,
      parentId: ""
    })
    setEditingCategory(null)
    setShowForm(false)
    
    alert(editingCategory ? "Category updated successfully! 🎉" : "Category added successfully! 🎉")
  }

  // Handle delete
  const handleDelete = (categoryId: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId))
    }
  }

  // Handle edit
  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      color: category.color,
      isActive: category.isActive,
      parentId: ""
    })
    setShowForm(true)
  }

  // Render category tree with products
  const renderCategoryTree = (category: Category, level: number = 0) => {
    const isExpanded = expandedCategories.has(category.id)
    const categoryProducts = getProductsInCategory(category.name)
    const hasProducts = categoryProducts.length > 0

    return (
      <div key={category.id} className="animate-fade-in">
        <div 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group ${
            selectedCategory === category.id ? 'bg-gray-50 border border-[#c9a84c]/30' : ''
          }`}
          style={{ paddingLeft: `${level * 20 + 16}px` }}
        >
          {/* Expand/Collapse Button */}
          {hasProducts && (
            <button 
              onClick={() => toggleCategory(category.id)}
              className="p-1 hover:bg-gray-200 rounded-lg transition-colors border-0 cursor-pointer"
            >
              {isExpanded ? 
                <ChevronDown className="w-4 h-4 text-gray-500" /> : 
                <ChevronRight className="w-4 h-4 text-gray-500" />
              }
            </button>
          )}
          {!hasProducts && <div className="w-6" />}

          {/* Category Icon */}
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
            style={{ backgroundColor: `${category.color}20`, color: category.color }}
          >
            {category.icon}
          </div>

          {/* Category Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900">{category.name}</h3>
              {!category.isActive && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Inactive</span>
              )}
            </div>
            <p className="text-xs text-gray-500">{category.description}</p>
          </div>

          {/* Product Count */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
              <Package className="w-3 h-3" />
              {categoryProducts.length} products
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {categoryProducts.length > 0 && (
              <button 
                onClick={() => handleViewCategoryProducts(category.name)}
                className="p-1.5 text-gray-400 hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 rounded-lg transition-colors border-0 cursor-pointer"
                title="View products in this category"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
            <button 
              onClick={() => handleEdit(category)}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border-0 cursor-pointer"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleDelete(category.id)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border-0 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Show Products in Category when expanded */}
        {hasProducts && isExpanded && (
          <div className="ml-12 mt-2 space-y-1">
            <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              Products in {category.name}
            </div>
            {categoryProducts.slice(0, 5).map((product) => (
              <div 
                key={product.id} 
                className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.brand}</p>
                </div>
                <span className="text-sm font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
              </div>
            ))}
            {categoryProducts.length > 5 && (
              <button 
                onClick={() => handleViewCategoryProducts(category.name)}
                className="text-xs text-[#c9a84c] font-medium hover:underline border-0 bg-transparent cursor-pointer"
              >
                View all {categoryProducts.length} products →
              </button>
            )}
          </div>
        )}
      </div>
    )
  }

  // Category stats
  const categoryStats = useMemo(() => {
    const totalProducts = products.length
    const totalCategories = categories.length
    const activeCategories = categories.filter(c => c.isActive).length
    
    const uncategorized = products.filter(p => !p.category || p.category.trim() === '').length
    
    return { totalProducts, totalCategories, activeCategories, uncategorized }
  }, [products, categories])

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <FolderTree className="w-7 h-7 text-[#c9a84c]" />
              Category Management
              <span className="text-sm font-medium bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                {categories.length} categories
              </span>
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {categoryStats.totalProducts} products across {categoryStats.totalCategories} categories
              {categoryStats.uncategorized > 0 && (
                <span className="ml-2 text-amber-600">
                  • {categoryStats.uncategorized} uncategorized
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingCategory(null)
                setFormData({
                  name: "",
                  slug: "",
                  description: "",
                  icon: "📁",
                  color: "#c9a84c",
                  isActive: true,
                  parentId: ""
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
                  Add Category
                </>
              )}
            </button>
          </div>
        </div>

        {/* Category Form - FIXED: All labels now visible */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 animate-slide-down">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                {editingCategory ? (
                  <>
                    <Edit className="w-5 h-5 text-[#c9a84c]" />
                    Edit Category
                  </>
                ) : (
                  <>
                    <FolderPlus className="w-5 h-5 text-[#c9a84c]" />
                    Add New Category
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
                  <label className="text-sm font-bold text-gray-800 block mb-1">Category Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Fashion, Electronics"
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-800 block mb-1">Slug *</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="e.g., fashion, electronics"
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-800 block mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Category description..."
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent resize-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-800 block mb-1">Icon</label>
                  <input
                    type="text"
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    placeholder="e.g., 👗, 📱"
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-800 block mb-1">Color</label>
                  <div className="flex items-center gap-3 mt-1">
                    <input
                      type="color"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-12 h-12 rounded-xl border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={handleInputChange}
                      name="color"
                      className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all"
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
                  <label className="text-sm font-medium text-gray-700">Category is active</label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#1a1a2e]/20 transition-all duration-300 border-0 cursor-pointer"
                >
                  {editingCategory ? (
                    <>
                      <Edit className="w-4 h-4 inline mr-2" />
                      Update Category
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 inline mr-2" />
                      Create Category
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-1 ml-auto">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors border-0 cursor-pointer ${
                  viewMode === "list" ? "bg-[#c9a84c] text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors border-0 cursor-pointer ${
                  viewMode === "grid" ? "bg-[#c9a84c] text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Tree/Grid */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            {products.length === 0 ? (
              <>
                <Package className="w-16 h-16 text-gray-300 mx-auto" />
                <h3 className="text-lg font-semibold text-gray-700 mt-4">No products found</h3>
                <p className="text-sm text-gray-500 mt-1">Add products first to see categories automatically populated</p>
              </>
            ) : (
              <>
                <FolderTree className="w-16 h-16 text-gray-300 mx-auto" />
                <h3 className="text-lg font-semibold text-gray-700 mt-4">No categories found</h3>
                <p className="text-sm text-gray-500 mt-1">Create your first category to get started</p>
              </>
            )}
          </div>
        ) : viewMode === "list" ? (
          // List View - Category Tree with Products
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
            <div className="p-4 space-y-1">
              {filteredCategories.map(category => renderCategoryTree(category))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/50 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-gray-600">
                Showing <strong className="text-gray-900">{filteredCategories.length}</strong> of <strong className="text-gray-900">{categories.length}</strong> categories
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Layers className="w-4 h-4 text-[#c9a84c]" />
                <span>
                  {products.length} total products
                </span>
              </div>
            </div>
          </div>
        ) : (
          // Grid View with Product Previews
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category) => {
              const categoryProducts = getProductsInCategory(category.name)
              const productCount = categoryProducts.length
              return (
                <div 
                  key={category.id} 
                  className="group bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 hover:shadow-xl transition-all duration-300 hover:border-[#c9a84c]/20"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      {category.icon}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {productCount > 0 && (
                        <button 
                          onClick={() => handleViewCategoryProducts(category.name)}
                          className="p-1.5 text-gray-400 hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 rounded-lg transition-colors border-0 cursor-pointer"
                          title="View products"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleEdit(category)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border-0 cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(category.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border-0 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900">{category.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{category.description}</p>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      {productCount} products
                    </span>
                    {productCount > 0 && (
                      <button 
                        onClick={() => handleViewCategoryProducts(category.name)}
                        className="text-xs font-medium text-[#c9a84c] hover:underline border-0 bg-transparent cursor-pointer"
                      >
                        View all
                      </button>
                    )}
                  </div>

                  {/* Show first 3 products as preview */}
                  {productCount > 0 && (
                    <div className="mt-3 flex -space-x-2">
                      {categoryProducts.slice(0, 3).map((product) => (
                        <img 
                          key={product.id}
                          src={product.image} 
                          alt={product.name}
                          className="w-8 h-8 rounded-lg border-2 border-white object-cover"
                        />
                      ))}
                      {productCount > 3 && (
                        <div className="w-8 h-8 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500">
                          +{productCount - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Category Products Modal */}
      {showCategoryProducts && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-[#c9a84c]" />
                  {currentCategoryName}
                </h2>
                <p className="text-sm text-gray-600">{viewingCategoryProducts.length} products in this category</p>
              </div>
              <button 
                onClick={() => {
                  setShowCategoryProducts(false)
                  setViewingCategoryProducts([])
                }}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors border-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Products Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              {viewingCategoryProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="text-gray-500 mt-2">No products in this category</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {viewingCategoryProducts.map((product) => (
                    <div 
                      key={product.id}
                      className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group"
                    >
                      <div className="aspect-square bg-gray-50 relative">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        {product.originalPrice > product.price && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">{product.name}</h4>
                        <p className="text-xs text-gray-500">{product.brand}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                          {product.originalPrice > product.price && (
                            <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t p-4 bg-gray-50/50 flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Showing {viewingCategoryProducts.length} products
              </span>
              <button 
                onClick={() => {
                  setShowCategoryProducts(false)
                  setViewingCategoryProducts([])
                }}
                className="px-4 py-2 bg-[#1a1a2e] text-white rounded-lg text-sm font-medium hover:bg-[#16213e] transition-colors border-0 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}