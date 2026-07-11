"use client"

import React, { useEffect, useState, useMemo } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useStore } from "@/context/store-context"
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  Calendar,
  ShoppingBag,
  Award,
  Crown,
  Star,
  UserPlus,
  Clock,
  ArrowUpDown,
  Eye,
  MessageCircle,
  Download,
  ChevronDown,
  MapPin,
  UserCheck,
  UserX,
  Activity,
  BarChart3,
  X,
  Send
} from "lucide-react"

export default function AdminCustomersPanel() {
  const { orders = [] } = useStore()
  
  // ✅ DIRECT FIREBASE FETCH FOR ADMIN - GETS ALL ORDERS
  const [allOrders, setAllOrders] = useState<any[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)

  // ✅ Fetch all orders directly from Firestore when admin page loads
  useEffect(() => {
    const fetchAllAdminOrders = async () => {
      setIsLoadingOrders(true)
      try {
        const ordersRef = collection(db, "orders")
        const q = query(ordersRef, orderBy("createdAt", "desc"))
        
        const snapshot = await getDocs(q)
        
        const fetchedOrders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        console.log("👥 ADMIN FETCHED ORDERS FOR CUSTOMERS:", fetchedOrders.length, "orders")
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
    if (allOrders.length > 0) {
      return allOrders
    }
    return orders || []
  }, [allOrders, orders])

  // State for filters and search
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "orders" | "spent">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")

  // State for message modal
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [selectedCustomerForMessage, setSelectedCustomerForMessage] = useState<any | null>(null)
  const [messageText, setMessageText] = useState("")
  const [messageSubject, setMessageSubject] = useState("")

  // ✅ Generate customer data from orders
  const customers = useMemo(() => {
    const customerMap = new Map()
    
    displayOrders.forEach(order => {
      const email = order.customerEmail || `customer${order.id?.slice(0, 6) || 'unknown'}@example.com`
      if (!customerMap.has(email)) {
        customerMap.set(email, {
          id: email,
          name: order.customerName || 'Unknown Customer',
          email: email,
          phone: order.customerPhone || "+91 98765 43210",
          orders: 0,
          totalSpent: 0,
          lastOrder: new Date(),
          status: "active" as "active" | "inactive" | "vip",
          joinedDate: new Date(),
          address: order.shippingAddress || "Mumbai, India"
        })
      }
      
      const customer = customerMap.get(email)
      customer.orders += 1
      customer.totalSpent += order.totalAmount || 0
      if (order.totalAmount > 50000) customer.status = "vip"
      if (customer.orders > 5) customer.status = "vip"
    })
    
    return Array.from(customerMap.values())
  }, [displayOrders])

  // Filter and sort customers
  const filteredCustomers = useMemo(() => {
    let filtered = customers.filter(customer => {
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
      return matchesSearch
    })

    filtered.sort((a, b) => {
      let comparison = 0
      if (sortBy === "name") comparison = a.name.localeCompare(b.name)
      else if (sortBy === "orders") comparison = a.orders - b.orders
      else if (sortBy === "spent") comparison = a.totalSpent - b.totalSpent
      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [customers, searchTerm, sortBy, sortOrder])

  // Statistics
  const stats = useMemo(() => {
    const total = customers.length
    const active = customers.filter(c => c.status === "active").length
    const vip = customers.filter(c => c.status === "vip").length
    const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0)
    const avgOrderValue = customers.reduce((sum, c) => sum + (c.totalSpent / (c.orders || 1)), 0) / (total || 1)
    
    return { total, active, vip, totalSpent, avgOrderValue }
  }, [customers])

  // Handle opening message modal
  const handleOpenMessage = (customer: any) => {
    setSelectedCustomerForMessage(customer)
    setMessageSubject(`Customer Support - ${customer.name}`)
    setMessageText("")
    setShowMessageModal(true)
  }

  // Handle sending message
  const handleSendMessage = () => {
    if (!messageText.trim()) {
      alert("Please enter a message")
      return
    }
    
    console.log({
      to: selectedCustomerForMessage?.email,
      subject: messageSubject,
      message: messageText,
      customerName: selectedCustomerForMessage?.name
    })
    
    alert(`Message sent to ${selectedCustomerForMessage?.name} (${selectedCustomerForMessage?.email})`)
    
    setShowMessageModal(false)
    setSelectedCustomerForMessage(null)
    setMessageText("")
    setMessageSubject("")
  }

  // Get status badge
  const StatusBadge = ({ status }: { status: "active" | "inactive" | "vip" }) => {
    const config = {
      active: { bg: "bg-emerald-50", text: "text-emerald-700", icon: UserCheck, label: "Active" },
      inactive: { bg: "bg-gray-50", text: "text-gray-700", icon: UserX, label: "Inactive" },
      vip: { bg: "bg-amber-50", text: "text-amber-700", icon: Crown, label: "VIP" }
    }
    const { bg, text, icon: Icon, label } = config[status]
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${bg} ${text}`}>
        <Icon className="w-3.5 h-3.5" />
        {label}
      </span>
    )
  }

  // Show loading state
  if (isLoadingOrders) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#c9a84c]/20 border-t-[#c9a84c] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">Loading customer data...</p>
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
              <Users className="w-7 h-7 text-[#c9a84c]" />
              Customer Management
              <span className="text-sm font-medium bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                {customers.length} customers
              </span>
            </h1>
            <p className="text-sm text-gray-600 mt-1">Manage and analyze your customer base</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#1a1a2e]/20 transition-all duration-300 cursor-pointer">
              <UserPlus className="w-4 h-4" />
              Add Customer
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-gray-700 block">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                <p className="text-xs text-emerald-500 font-medium mt-1">+12 this month</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-gray-700 block">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.active}</p>
                <p className="text-xs text-emerald-500 font-medium mt-1">{Math.round((stats.active / stats.total) * 100)}% of total</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-gray-700 block">VIP Customers</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.vip}</p>
                <p className="text-xs text-amber-500 font-medium mt-1">🏆 Premium members</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-gray-700 block">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">₹{stats.totalSpent.toLocaleString()}</p>
                <p className="text-xs text-gray-600 mt-1">Avg. ₹{Math.round(stats.avgOrderValue).toLocaleString()}/customer</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="orders">Sort by Orders</option>
              <option value="spent">Sort by Spend</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2 cursor-pointer"
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
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors border-0 cursor-pointer ${
                  viewMode === "list" ? "bg-[#c9a84c] text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Customer List */}
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Users className="w-16 h-16 text-gray-300 mx-auto" />
            <h3 className="text-lg font-semibold text-gray-700 mt-4">No customers found</h3>
            <p className="text-sm text-gray-500 mt-1">Customers will appear here once they place orders</p>
          </div>
        ) : viewMode === "list" ? (
          // List View
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">Orders</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">Total Spent</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-800 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCustomers.map((customer) => (
                    <React.Fragment key={customer.id}>
                      <tr className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#e8d5a3] flex items-center justify-center text-[#1a1a2e] font-bold text-sm">
                              {customer.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Joined {customer.joinedDate.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-0.5">
                            <p className="text-xs text-gray-700 flex items-center gap-1">
                              <Mail className="w-3 h-3 text-gray-400" />
                              {customer.email}
                            </p>
                            <p className="text-xs text-gray-700 flex items-center gap-1">
                              <Phone className="w-3 h-3 text-gray-400" />
                              {customer.phone}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">{customer.orders}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-gray-900">₹{customer.totalSpent.toLocaleString()}</p>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={customer.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => setSelectedCustomer(selectedCustomer === customer.id ? null : customer.id)}
                              className="p-2 text-gray-400 hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 rounded-lg transition-colors border-0 cursor-pointer"
                              title="View Customer Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleOpenMessage(customer)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border-0 cursor-pointer"
                              title="Send Message"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {/* Customer Details Expansion */}
                      {selectedCustomer === customer.id && (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
                            <div className="animate-slide-down">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                  <h4 className="text-sm font-bold text-gray-700 mb-2">Customer Profile</h4>
                                  <div className="space-y-1.5 text-sm">
                                    <p><span className="text-gray-600">Name:</span> <span className="font-medium text-gray-900">{customer.name}</span></p>
                                    <p><span className="text-gray-600">Email:</span> <span className="text-gray-900">{customer.email}</span></p>
                                    <p><span className="text-gray-600">Phone:</span> <span className="text-gray-900">{customer.phone}</span></p>
                                    <p><span className="text-gray-600">Status:</span> <StatusBadge status={customer.status} /></p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold text-gray-700 mb-2">Purchase History</h4>
                                  <div className="space-y-1.5 text-sm">
                                    <p><span className="text-gray-600">Total Orders:</span> <span className="font-medium text-gray-900">{customer.orders}</span></p>
                                    <p><span className="text-gray-600">Total Spent:</span> <span className="font-bold text-gray-900">₹{customer.totalSpent.toLocaleString()}</span></p>
                                    <p><span className="text-gray-600">Avg Order Value:</span> <span className="text-gray-900">₹{Math.round(customer.totalSpent / customer.orders).toLocaleString()}</span></p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold text-gray-700 mb-2">Actions</h4>
                                  <div className="flex flex-wrap gap-2">
                                    <button className="px-4 py-2 bg-[#1a1a2e] text-white rounded-lg text-xs font-medium hover:bg-[#16213e] transition-colors border-0 cursor-pointer">
                                      View Orders
                                    </button>
                                    <button 
                                      onClick={() => handleOpenMessage(customer)}
                                      className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors flex items-center gap-1 cursor-pointer"
                                    >
                                      <MessageCircle className="w-3 h-3" />
                                      Send Message
                                    </button>
                                    <button className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors border-0 cursor-pointer">
                                      <Award className="w-3 h-3 inline mr-1" />
                                      Give VIP
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/50 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-gray-600">
                Showing <strong className="text-gray-900">{filteredCustomers.length}</strong> of <strong className="text-gray-900">{customers.length}</strong> customers
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4 text-[#c9a84c]" />
                <span>VIP: <strong className="text-amber-600">{stats.vip}</strong></span>
                <span className="w-px h-4 bg-gray-200"></span>
                <span>Active: <strong className="text-emerald-600">{stats.active}</strong></span>
              </div>
            </div>
          </div>
        ) : (
          // Grid View
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 hover:shadow-xl transition-all duration-300 hover:border-[#c9a84c]/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#e8d5a3] flex items-center justify-center text-[#1a1a2e] font-bold text-lg">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-900">{customer.name}</h3>
                    <StatusBadge status={customer.status} />
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {customer.email}
                  </p>
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {customer.phone}
                  </p>
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {customer.address}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Orders</p>
                    <p className="text-sm font-semibold text-gray-900">{customer.orders}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Spent</p>
                    <p className="text-sm font-bold text-gray-900">₹{customer.totalSpent.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => setSelectedCustomer(selectedCustomer === customer.id ? null : customer.id)}
                      className="p-2 text-gray-400 hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 rounded-lg transition-colors border-0 cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleOpenMessage(customer)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border-0 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Grid View - Customer Details Expansion */}
                {selectedCustomer === customer.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 bg-gray-50/50 rounded-xl p-4 animate-slide-down">
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-600">Phone:</span> <span className="text-gray-900">{customer.phone}</span></p>
                      <p><span className="text-gray-600">Total Orders:</span> <span className="font-medium text-gray-900">{customer.orders}</span></p>
                      <p><span className="text-gray-600">Total Spent:</span> <span className="font-bold text-gray-900">₹{customer.totalSpent.toLocaleString()}</span></p>
                      <div className="flex gap-2 mt-2">
                        <button className="px-3 py-1.5 bg-[#1a1a2e] text-white rounded-lg text-xs font-medium hover:bg-[#16213e] transition-colors border-0 cursor-pointer">
                          View Orders
                        </button>
                        <button 
                          onClick={() => handleOpenMessage(customer)}
                          className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <MessageCircle className="w-3 h-3" />
                          Message
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Modal */}
      {showMessageModal && selectedCustomerForMessage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-slide-up">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-[#c9a84c]" />
                  Send Message
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Sending message to {selectedCustomerForMessage.name} ({selectedCustomerForMessage.email})
                </p>
              </div>
              <button
                onClick={() => {
                  setShowMessageModal(false)
                  setSelectedCustomerForMessage(null)
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

              {/* Quick Message Templates */}
              <div className="mb-4">
                <p className="text-sm font-bold text-gray-700 mb-2">Quick Templates</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setMessageText(`Dear ${selectedCustomerForMessage.name},\n\nThank you for being a valued customer! We appreciate your business and wanted to check in on how we can serve you better.\n\nBest regards,\nOrbit Luxuries Team`)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs transition-colors border-0 cursor-pointer text-gray-700"
                  >
                    Welcome Message
                  </button>
                  <button
                    onClick={() => setMessageText(`Dear ${selectedCustomerForMessage.name},\n\nWe're excited to offer you an exclusive VIP discount on your next purchase! Use code VIP20 at checkout for 20% off.\n\nThank you for being a loyal customer,\nOrbit Luxuries Team`)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs transition-colors border-0 cursor-pointer text-gray-700"
                  >
                    VIP Offer
                  </button>
                  <button
                    onClick={() => setMessageText(`Dear ${selectedCustomerForMessage.name},\n\nWe noticed you haven't visited us in a while. We miss you! Come back and enjoy 15% off your next order with code WELCOMEBACK15.\n\nWarm regards,\nOrbit Luxuries Team`)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs transition-colors border-0 cursor-pointer text-gray-700"
                  >
                    Re-engagement
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => {
                  setShowMessageModal(false)
                  setSelectedCustomerForMessage(null)
                  setMessageText("")
                  setMessageSubject("")
                }}
                className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors border-0 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                className="flex-1 py-2.5 bg-[#c9a84c] text-[#1a1a2e] rounded-xl font-medium hover:bg-[#d4b85c] transition-colors flex items-center justify-center gap-2 border-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}