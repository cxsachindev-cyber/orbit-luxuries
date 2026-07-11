"use client"

import React, { useState, useMemo, useEffect } from "react"
import { useStore } from "@/context/store-context"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  ChevronDown, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  Download,
  Printer,
  RefreshCw,
  Calendar,
  ArrowUpDown,
  Mail,
  Phone,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  User,
  CreditCard,
  Home,
  Hash,
  IndianRupee
} from "lucide-react"

type OrderStatus = "Pending" | "Confirmed" | "Processing" | "Shipped" | "Delivered" | "Cancelled"

export default function AdminOrdersQueue() {
  const { orders, updateOrderStatus, products } = useStore()
  
  // ✅ DIRECT FIREBASE FETCH FOR ADMIN - GETS ALL ORDERS
  const [allOrders, setAllOrders] = useState<any[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)

  // ✅ Fetch all orders directly from Firestore when admin page loads
  useEffect(() => {
    const fetchAllAdminOrders = async () => {
      setIsLoadingOrders(true)
      try {
        // Query the root "orders" collection for EVERYTHING
        const ordersRef = collection(db, "orders")
        // Sort by newest first using createdAt field
        const q = query(ordersRef, orderBy("createdAt", "desc"))
        
        const snapshot = await getDocs(q)
        
        const fetchedOrders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        console.log("🛒 ADMIN FETCHED ORDERS:", fetchedOrders.length, "orders")
        setAllOrders(fetchedOrders)
      } catch (error) {
        console.error("❌ Admin fetch failed:", error)
      } finally {
        setIsLoadingOrders(false)
      }
    }

    fetchAllAdminOrders()
  }, [])

  // ✅ Use directly fetched orders OR fallback to store orders
  const displayOrders = useMemo(() => {
    // If we have orders from direct fetch, use them
    if (allOrders.length > 0) {
      return allOrders
    }
    // Otherwise fallback to store orders
    return orders || []
  }, [allOrders, orders])

  // State for filters and search
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("")
  const [dateFilter, setDateFilter] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"date" | "amount" | "status">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const ordersPerPage = 10
  
  // State for viewing product details
  const [viewingProduct, setViewingProduct] = useState<any | null>(null)
  const [currentProductIndex, setCurrentProductIndex] = useState(0)
  const [currentOrderProducts, setCurrentOrderProducts] = useState<any[]>([])

  // State for message modal
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<{name: string, email: string, orderId: string} | null>(null)
  const [messageText, setMessageText] = useState("")
  const [messageSubject, setMessageSubject] = useState("")

  // State for full order details modal
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false)
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any | null>(null)

  // Status color mapping
  const statusColors: Record<OrderStatus, { bg: string, text: string, icon: any }> = {
    Pending: { bg: "bg-amber-50", text: "text-amber-700", icon: Clock },
    Confirmed: { bg: "bg-blue-50", text: "text-blue-700", icon: CheckCircle },
    Processing: { bg: "bg-purple-50", text: "text-purple-700", icon: RefreshCw },
    Shipped: { bg: "bg-indigo-50", text: "text-indigo-700", icon: Truck },
    Delivered: { bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle },
    Cancelled: { bg: "bg-red-50", text: "text-red-700", icon: XCircle }
  }

  // Status order for sorting
  const statusOrder = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"]

  // Helper function to get product details from database
  const getProductDetails = (item: any) => {
    console.log("Getting product details for item:", item)
    
    let productId = null
    
    if (item.product && typeof item.product === 'object') {
      productId = item.product.id || item.product.productId || null
    }
    
    if (!productId && item.id) {
      productId = item.id
    }
    
    if (!productId && item.productId) {
      productId = item.productId
    }
    
    if (!productId && typeof item === 'string') {
      productId = item
    }
    
    if (productId) {
      console.log("Looking for product with ID:", productId)
      const foundProduct = products.find(p => p.id === productId)
      if (foundProduct) {
        console.log("Found product:", foundProduct.name)
        return {
          id: foundProduct.id,
          name: foundProduct.name,
          brand: foundProduct.brand || "",
          image: foundProduct.image || "/api/placeholder/40/40",
          price: foundProduct.price || 0,
          originalPrice: foundProduct.originalPrice || 0,
          description: foundProduct.description || "",
          specs: foundProduct.specs || [],
          sizes: foundProduct.sizes || []
        }
      }
    }
    
    console.log("Using fallback data from item")
    return {
      id: item.product?.id || item.id || item.productId || "N/A",
      name: item.product?.name || item.name || item.productName || "Unknown Product",
      brand: item.product?.brand || item.brand || "",
      image: item.product?.image || item.image || "/api/placeholder/40/40",
      price: item.product?.price || item.price || 0,
      originalPrice: item.product?.originalPrice || item.originalPrice || 0,
      description: item.product?.description || item.description || "",
      specs: item.product?.specs || item.specs || [],
      sizes: item.product?.sizes || item.sizes || []
    }
  }

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let filtered = displayOrders.filter(order => {
      const matchesSearch = 
        order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customerEmail?.toLowerCase() || "").includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "" || order.status === statusFilter
      return matchesSearch && matchesStatus
    })

    filtered.sort((a, b) => {
      let comparison = 0
      if (sortBy === "amount") {
        comparison = (a.totalAmount || 0) - (b.totalAmount || 0)
      } else if (sortBy === "status") {
        comparison = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
      } else {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        comparison = dateA - dateB
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [displayOrders, searchTerm, statusFilter, sortBy, sortOrder])

  // Get current page orders
  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)

  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, sortBy, sortOrder])

  const goToPage = (pageNumber: number) => {
    setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)))
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push('...')
        pageNumbers.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1)
        pageNumbers.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i)
        }
      } else {
        pageNumbers.push(1)
        pageNumbers.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push('...')
        pageNumbers.push(totalPages)
      }
    }
    
    return pageNumbers
  }

  // Statistics
  const stats = useMemo(() => {
    const total = displayOrders.length
    const pending = displayOrders.filter(o => o.status === "Pending").length
    const processing = displayOrders.filter(o => o.status === "Processing").length
    const shipped = displayOrders.filter(o => o.status === "Shipped").length
    const delivered = displayOrders.filter(o => o.status === "Delivered").length
    const cancelled = displayOrders.filter(o => o.status === "Cancelled").length
    const revenue = displayOrders
      .filter(o => o.status !== "Cancelled")
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0)
    
    return { total, pending, processing, shipped, delivered, cancelled, revenue }
  }, [displayOrders])

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus)
  }

  const handleViewProducts = (order: any) => {
    if (!order.items || order.items.length === 0) {
      alert("No products found in this order")
      return
    }
    
    const products = order.items.map((item: any) => {
      const productDetails = getProductDetails(item)
      return {
        ...productDetails,
        quantity: item.quantity || 1,
        selectedSize: item.selectedSize || item.size || "One Size"
      }
    })
    
    setCurrentOrderProducts(products)
    setCurrentProductIndex(0)
    setViewingProduct(products[0])
  }

  const handleViewOrderDetails = (order: any) => {
    const enhancedItems = order.items?.map((item: any) => {
      const productDetails = getProductDetails(item)
      return {
        ...item,
        product: {
          ...item.product,
          id: productDetails.id,
          name: productDetails.name,
          brand: productDetails.brand,
          image: productDetails.image,
          price: productDetails.price,
          originalPrice: productDetails.originalPrice,
          description: productDetails.description,
          specs: productDetails.specs,
          sizes: productDetails.sizes
        }
      }
    })
    
    const enhancedOrder = {
      ...order,
      items: enhancedItems
    }
    
    setSelectedOrderDetails(enhancedOrder)
    setShowOrderDetailsModal(true)
  }

  const handleOpenMessage = (order: any) => {
    setSelectedCustomer({
      name: order.customerName,
      email: order.customerEmail || "No email provided",
      orderId: order.id
    })
    setMessageSubject(`Order #${order.id} - Update`)
    setMessageText("")
    setShowMessageModal(true)
  }

  const handleSendMessage = () => {
    if (!messageText.trim()) {
      alert("Please enter a message")
      return
    }
    
    console.log({
      to: selectedCustomer?.email,
      subject: messageSubject,
      message: messageText,
      orderId: selectedCustomer?.orderId
    })
    
    alert(`Message sent to ${selectedCustomer?.name} (${selectedCustomer?.email})`)
    
    setShowMessageModal(false)
    setSelectedCustomer(null)
    setMessageText("")
    setMessageSubject("")
  }

  const navigateProduct = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentProductIndex > 0) {
      const newIndex = currentProductIndex - 1
      setCurrentProductIndex(newIndex)
      setViewingProduct(currentOrderProducts[newIndex])
    } else if (direction === 'next' && currentProductIndex < currentOrderProducts.length - 1) {
      const newIndex = currentProductIndex + 1
      setCurrentProductIndex(newIndex)
      setViewingProduct(currentOrderProducts[newIndex])
    }
  }

  const StatusBadge = ({ status }: { status: OrderStatus }) => {
    const { bg, text, icon: Icon } = statusColors[status]
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${bg} ${text}`}>
        <Icon className="w-3.5 h-3.5" />
        {status}
      </span>
    )
  }

  // Show loading state
  if (isLoadingOrders) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#c9a84c]/20 border-t-[#c9a84c] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <ShoppingCart className="w-7 h-7 text-[#c9a84c]" />
              Order Management
              <span className="text-sm font-medium bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                {displayOrders.length} orders
              </span>
            </h1>
            <p className="text-sm text-gray-600 mt-1">Track, process, and manage all customer orders</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors border-0 cursor-pointer">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors border-0 cursor-pointer">
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100/50 p-4 hover:shadow-md transition-shadow">
            <p className="text-sm font-bold text-gray-700 block">Total</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100/50 p-4 hover:shadow-md transition-shadow">
            <p className="text-sm font-bold text-gray-700 block">Pending</p>
            <p className="text-xl font-bold text-amber-600 mt-1">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100/50 p-4 hover:shadow-md transition-shadow">
            <p className="text-sm font-bold text-gray-700 block">Processing</p>
            <p className="text-xl font-bold text-purple-600 mt-1">{stats.processing}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100/50 p-4 hover:shadow-md transition-shadow">
            <p className="text-sm font-bold text-gray-700 block">Shipped</p>
            <p className="text-xl font-bold text-indigo-600 mt-1">{stats.shipped}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100/50 p-4 hover:shadow-md transition-shadow">
            <p className="text-sm font-bold text-gray-700 block">Delivered</p>
            <p className="text-xl font-bold text-emerald-600 mt-1">{stats.delivered}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100/50 p-4 hover:shadow-md transition-shadow">
            <p className="text-sm font-bold text-gray-700 block">Revenue</p>
            <p className="text-xl font-bold text-gray-900 mt-1">₹{stats.revenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders by ID or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "")}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent min-w-[140px]"
            >
              <option value="">All Status</option>
              {Object.keys(statusColors).map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="status">Sort by Status</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2 border-0 cursor-pointer"
            >
              <ArrowUpDown className="w-4 h-4" />
              {sortOrder === "asc" ? "Oldest" : "Newest"}
            </button>

            <button className="px-4 py-2.5 bg-[#c9a84c] text-[#1a1a2e] rounded-xl text-sm font-semibold hover:bg-[#d4b85c] transition-colors flex items-center gap-2 ml-auto border-0 cursor-pointer">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Orders Table */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Package className="w-16 h-16 text-gray-300 mx-auto" />
            <h3 className="text-lg font-semibold text-gray-700 mt-4">No orders found</h3>
            <p className="text-sm text-gray-500 mt-1">Orders will appear here once customers place them</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                      Order Details
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-800 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                      {/* Product Name Column */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {order.items?.slice(0, 2).map((item: any, index: number) => {
                            const product = getProductDetails(item)
                            return (
                              <p key={index} className="text-sm font-medium text-gray-900">
                                {product.name}
                              </p>
                            )
                          })}
                          {order.items?.length > 2 && (
                            <p className="text-xs text-gray-500">
                              +{order.items.length - 2} more
                            </p>
                          )}
                        </div>
                      </td>
                      {/* Order Details Column */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-mono font-semibold text-gray-900">{order.id}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3" />
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                            {order.createdAt && ` • ${new Date(order.createdAt).toLocaleTimeString()}`}
                          </p>
                        </div>
                      </td>
                      {/* Customer Column */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {order.customerEmail && (
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {order.customerEmail}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      {/* Amount Column */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-bold text-gray-900">₹{order.totalAmount?.toLocaleString() || "0"}</p>
                          <p className="text-xs text-gray-500">{order.items?.length || 0} items</p>
                        </div>
                      </td>
                      {/* Status Column */}
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all ${
                            order.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200" :
                            order.status === "Confirmed" ? "bg-blue-50 text-blue-700 border-blue-200" :
                            order.status === "Processing" ? "bg-purple-50 text-purple-700 border-purple-200" :
                            order.status === "Shipped" ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
                            order.status === "Delivered" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                            "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          <option value="Pending">⏳ Pending</option>
                          <option value="Confirmed">✓ Confirmed</option>
                          <option value="Processing">🔄 Processing</option>
                          <option value="Shipped">📦 Shipped</option>
                          <option value="Delivered">✅ Delivered</option>
                          <option value="Cancelled">❌ Cancelled</option>
                        </select>
                      </td>
                      {/* Actions Column */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleViewOrderDetails(order)}
                            className="p-2 text-gray-400 hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 rounded-lg transition-colors border-0 cursor-pointer"
                            title="View Full Order Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <button 
                            onClick={() => handleViewProducts(order)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border-0 cursor-pointer"
                            title="View Products in Order"
                          >
                            <Package className="w-4 h-4" />
                          </button>
                          
                          <button 
                            onClick={() => handleOpenMessage(order)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors border-0 cursor-pointer"
                            title="Message Customer"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/50 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package className="w-4 h-4 text-[#c9a84c]" />
                  <span>
                    Showing <strong className="text-gray-900">
                      {indexOfFirstOrder + 1} - {Math.min(indexOfLastOrder, filteredOrders.length)}
                    </strong> of <strong className="text-gray-900">{filteredOrders.length}</strong> orders
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg transition-colors border-0 cursor-pointer ${
                      currentPage === 1 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === 'number' ? goToPage(page) : null}
                      className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors border-0 cursor-pointer ${
                        page === currentPage
                          ? 'bg-[#c9a84c] text-[#1a1a2e] font-bold'
                          : page === '...'
                          ? 'text-gray-400 cursor-default'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      disabled={page === '...'}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg transition-colors border-0 cursor-pointer ${
                      currentPage === totalPages 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Show:</span>
                  <select
                    value={ordersPerPage}
                    onChange={(e) => {}}
                    className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent"
                    disabled
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>
            )}

            {/* Table Footer */}
            {totalPages <= 1 && (
              <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/50 flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-gray-600">
                  Showing <strong className="text-gray-900">{filteredOrders.length}</strong> of <strong className="text-gray-900">{displayOrders.length}</strong> orders
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package className="w-4 h-4 text-[#c9a84c]" />
                  <span>Total revenue: <strong className="text-gray-900">₹{stats.revenue.toLocaleString()}</strong></span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Full Order Details Modal */}
      {showOrderDetailsModal && selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto animate-slide-up">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 px-8 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-[#c9a84c]" />
                  Order Details
                </h2>
                <p className="text-sm text-gray-600">Complete order information for #{selectedOrderDetails.id}</p>
              </div>
              <button 
                onClick={() => {
                  setShowOrderDetailsModal(false)
                  setSelectedOrderDetails(null)
                }} 
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full cursor-pointer border-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8">
              {/* Order Status & Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Hash className="w-4 h-4" />
                    <span className="text-sm font-bold text-gray-700">Order ID</span>
                  </div>
                  <p className="font-mono font-bold text-gray-900">{selectedOrderDetails.id}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-bold text-gray-700">Order Date</span>
                  </div>
                  <p className="font-medium text-gray-900">
                    {selectedOrderDetails.createdAt ? new Date(selectedOrderDetails.createdAt).toLocaleString() : "N/A"}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-sm font-bold text-gray-700">Payment Method</span>
                  </div>
                  <p className="font-medium text-gray-900">{selectedOrderDetails.paymentMethod || "N/A"}</p>
                </div>
              </div>

              {/* Customer Information */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-4">
                  <User className="w-4 h-4 text-[#c9a84c]" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-bold text-gray-700">Full Name</p>
                    <p className="font-medium text-gray-900">{selectedOrderDetails.customerName}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-bold text-gray-700">Email Address</p>
                    <p className="font-medium text-gray-900">{selectedOrderDetails.customerEmail || "N/A"}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-bold text-gray-700">Phone Number</p>
                    <p className="font-medium text-gray-900">{selectedOrderDetails.customerPhone || "N/A"}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-bold text-gray-700">Order Status</p>
                    <div className="mt-1">
                      <StatusBadge status={selectedOrderDetails.status as OrderStatus} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-4">
                  <Home className="w-4 h-4 text-[#c9a84c]" />
                  Shipping Address
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-900">{selectedOrderDetails.shippingAddress || "No address provided"}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-4">
                  <Package className="w-4 h-4 text-[#c9a84c]" />
                  Order Items ({selectedOrderDetails.items?.length || 0})
                </h3>
                <div className="bg-gray-50 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">S.No</th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Product Image</th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Product Name</th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Brand</th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Size</th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Qty</th>
                          <th className="px-4 py-3 text-right text-sm font-bold text-gray-700">Price</th>
                          <th className="px-4 py-3 text-right text-sm font-bold text-gray-700">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {selectedOrderDetails.items?.map((item: any, index: number) => {
                          const productDetails = getProductDetails(item)
                          
                          const productName = productDetails.name
                          const productBrand = productDetails.brand
                          const productImage = productDetails.image
                          const productPrice = productDetails.price
                          const productSize = item.selectedSize || item.size || "One Size"
                          const productQuantity = item.quantity || 1
                          
                          return (
                            <tr key={index} className="hover:bg-white transition-colors">
                              <td className="px-4 py-3">
                                <span className="text-sm font-medium text-gray-600">{index + 1}</span>
                              </td>
                              <td className="px-4 py-3">
                                <img 
                                  src={productImage} 
                                  alt={productName}
                                  className="w-12 h-12 rounded-lg object-cover bg-gray-200 border border-gray-200"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/api/placeholder/40/40"
                                  }}
                                />
                              </td>
                              <td className="px-4 py-3">
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">{productName}</p>
                                  <p className="text-xs text-gray-500">ID: {productDetails.id}</p>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-sm font-medium text-gray-700">{productBrand || "N/A"}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                  {productSize}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                  × {productQuantity}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className="text-sm font-medium text-gray-700">₹{Number(productPrice).toLocaleString()}</span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className="text-sm font-bold text-gray-900">₹{Number(productPrice * productQuantity).toLocaleString()}</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot className="bg-gray-100/50 border-t border-gray-200">
                        <tr>
                          <td colSpan={7} className="px-4 py-3 text-right">
                            <span className="text-base font-semibold text-gray-700">Total Amount:</span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-xl font-bold text-gray-900">₹{selectedOrderDetails.totalAmount?.toLocaleString() || "0"}</span>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowOrderDetailsModal(false)
                    setSelectedOrderDetails(null)
                  }}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors border-0 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowOrderDetailsModal(false)
                    handleOpenMessage(selectedOrderDetails)
                  }}
                  className="flex-1 py-3 bg-[#c9a84c] text-[#1a1a2e] rounded-xl font-medium hover:bg-[#d4b85c] transition-colors flex items-center justify-center gap-2 border-0 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  Message Customer
                </button>
                <button
                  onClick={() => {
                    setShowOrderDetailsModal(false)
                    handleViewProducts(selectedOrderDetails)
                  }}
                  className="flex-1 py-3 bg-[#1a1a2e] text-white rounded-xl font-medium hover:bg-[#16213e] transition-colors flex items-center justify-center gap-2 border-0 cursor-pointer"
                >
                  <Package className="w-4 h-4" />
                  View Products
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product View Modal with Navigation */}
      {viewingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex overflow-hidden animate-slide-up max-h-[90vh]">
            <div className="w-2/5 bg-gray-100 relative">
              <img 
                src={viewingProduct.image || "/api/placeholder/400/400"} 
                className="w-full h-full object-cover" 
                alt={viewingProduct.name || "Product"} 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/api/placeholder/400/400"
                }}
              />
              {viewingProduct.originalPrice && viewingProduct.originalPrice > viewingProduct.price && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-lg">
                  {Math.round((1 - viewingProduct.price / viewingProduct.originalPrice) * 100)}% OFF
                </div>
              )}
              {viewingProduct.quantity && (
                <div className="absolute bottom-4 right-4 bg-[#1a1a2e] text-white text-xs font-bold px-3 py-1 rounded-lg">
                  Qty: {viewingProduct.quantity}
                </div>
              )}
              {viewingProduct.selectedSize && (
                <div className="absolute bottom-4 left-4 bg-[#c9a84c] text-[#1a1a2e] text-xs font-bold px-3 py-1 rounded-lg">
                  Size: {viewingProduct.selectedSize}
                </div>
              )}
            </div>

            <div className="w-3/5 p-8 relative overflow-y-auto">
              <button 
                onClick={() => {
                  setViewingProduct(null)
                  setCurrentOrderProducts([])
                  setCurrentProductIndex(0)
                }} 
                className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors border-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {currentOrderProducts.length > 1 && (
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <button 
                    onClick={() => navigateProduct('prev')}
                    disabled={currentProductIndex === 0}
                    className={`p-1.5 rounded-lg transition-colors border-0 cursor-pointer ${
                      currentProductIndex === 0 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-medium text-gray-600">
                    {currentProductIndex + 1} / {currentOrderProducts.length}
                  </span>
                  <button 
                    onClick={() => navigateProduct('next')}
                    disabled={currentProductIndex === currentOrderProducts.length - 1}
                    className={`p-1.5 rounded-lg transition-colors border-0 cursor-pointer ${
                      currentProductIndex === currentOrderProducts.length - 1 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              <span className="text-[10px] font-bold uppercase tracking-widest text-[#c9a84c] mb-1 block mt-6">
                {viewingProduct.brand || "Premium Brand"}
              </span>

              <h2 className="text-2xl font-black text-gray-900 leading-tight mb-2">
                {viewingProduct.name || "Product Name"}
              </h2>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-xl font-bold text-gray-900">
                  ₹{Number(viewingProduct.price || 0).toLocaleString()}
                </span>
                {viewingProduct.originalPrice && viewingProduct.originalPrice > viewingProduct.price && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{Number(viewingProduct.originalPrice).toLocaleString()}
                  </span>
                )}
              </div>

              {viewingProduct.category && (
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                    {viewingProduct.category}
                  </span>
                </div>
              )}

              <div className="mb-4">
                <h4 className="text-sm font-bold text-gray-700 mb-2">Description</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {viewingProduct.description || "No description provided for this item."}
                </p>
              </div>

              {viewingProduct.specs && viewingProduct.specs.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-gray-700 mb-2">Specifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {viewingProduct.specs.map((spec: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {viewingProduct.sizes && viewingProduct.sizes.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-2">Available Sizes</h4>
                  <div className="flex flex-wrap gap-2">
                    {viewingProduct.sizes.map((size: string) => (
                      <span key={size} className={`px-4 py-2 text-xs font-bold rounded-lg ${
                        size === viewingProduct.selectedSize 
                          ? 'bg-[#c9a84c] text-[#1a1a2e]' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button 
                  onClick={() => {
                    setViewingProduct(null)
                    setCurrentOrderProducts([])
                    setCurrentProductIndex(0)
                  }}
                  className="flex-1 py-2.5 bg-[#1a1a2e] text-white rounded-xl font-medium hover:bg-[#16213e] transition-colors border-0 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-slide-up">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-[#c9a84c]" />
                  Message Customer
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Sending message to {selectedCustomer.name} ({selectedCustomer.email})
                </p>
              </div>
              <button
                onClick={() => {
                  setShowMessageModal(false)
                  setSelectedCustomer(null)
                  setMessageText("")
                  setMessageSubject("")
                }}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors border-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent"
                  placeholder="Enter message subject"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent resize-none"
                  placeholder="Type your message here..."
                />
              </div>

              <div className="mb-4">
                <p className="text-sm font-bold text-gray-700 mb-2">Quick Templates</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setMessageText(`Dear ${selectedCustomer.name},\n\nYour order #${selectedCustomer.orderId} has been confirmed and is being processed. We'll notify you once it ships.\n\nThank you for shopping with us!`)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs transition-colors border-0 cursor-pointer text-gray-700"
                  >
                    Order Confirmed
                  </button>
                  <button
                    onClick={() => setMessageText(`Dear ${selectedCustomer.name},\n\nYour order #${selectedCustomer.orderId} has been shipped and is on its way to you. You can track your order using the tracking number provided.\n\nThank you for your patience!`)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs transition-colors border-0 cursor-pointer text-gray-700"
                  >
                    Order Shipped
                  </button>
                  <button
                    onClick={() => setMessageText(`Dear ${selectedCustomer.name},\n\nYour order #${selectedCustomer.orderId} has been delivered successfully. We hope you enjoy your purchase!\n\nThank you for shopping with us.`)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs transition-colors border-0 cursor-pointer text-gray-700"
                  >
                    Order Delivered
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => {
                  setShowMessageModal(false)
                  setSelectedCustomer(null)
                  setMessageText("")
                  setMessageSubject("")
                }}
                className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors border-0 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                className="flex-1 py-2.5 bg-[#c9a84c] text-[#1a1a2e] rounded-xl font-medium hover:bg-[#d4b85c] transition-colors border-0 cursor-pointer"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}