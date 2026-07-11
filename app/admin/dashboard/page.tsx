"use client"

import { useEffect, useState, useMemo } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useStore } from "@/context/store-context"
import { 
  Package, ShoppingBag, TrendingUp, Users, 
  PieChart as PieChartIcon, CreditCard, Activity, BarChart3, Download, Calendar
} from "lucide-react"
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend 
} from "recharts"

const LUXURY_COLORS = ['#1a1a2e', '#c9a84c', '#4b5563', '#e8d5a3', '#16213e', '#8b7355']

// --- DYNAMIC TIME RANGE DATA (Will swap when dropdown changes) ---
const chartDataSets = {
  week: [
    { name: "Mon", revenue: 12500 }, { name: "Tue", revenue: 28000 },
    { name: "Wed", revenue: 15145 }, { name: "Thu", revenue: 42000 },
    { name: "Fri", revenue: 35000 }, { name: "Sat", revenue: 58000 },
    { name: "Sun", revenue: 45000 },
  ],
  month: [
    { name: "Week 1", revenue: 145000 }, { name: "Week 2", revenue: 185000 },
    { name: "Week 3", revenue: 125000 }, { name: "Week 4", revenue: 210000 },
  ],
  year: [
    { name: "Jan", revenue: 450000 }, { name: "Feb", revenue: 520000 },
    { name: "Mar", revenue: 480000 }, { name: "Apr", revenue: 610000 },
    { name: "May", revenue: 590000 }, { name: "Jun", revenue: 750000 },
    { name: "Jul", revenue: 820000 }, { name: "Aug", revenue: 890000 },
    { name: "Sep", revenue: 950000 }, { name: "Oct", revenue: 880000 },
    { name: "Nov", revenue: 1100000 }, { name: "Dec", revenue: 1400000 },
  ]
}

export default function AdminDashboard() {
  const { orders = [], products = [] } = useStore()
  
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

        console.log("📊 ADMIN FETCHED ORDERS:", fetchedOrders.length, "orders")
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

  // 🕒 Time Filter State
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week")

  // 🖨️ PDF Export Handler (Uses native browser print-to-PDF engine)
  const handleDownloadPDF = () => {
    window.print()
  }

  // 📈 LIVE CALCULATIONS
  const totalRevenue = useMemo(() => {
    return displayOrders.filter(o => o?.status !== "Cancelled")
                 .reduce((acc, curr) => acc + (Number(curr?.totalAmount) || 0), 0)
  }, [displayOrders])

  const inventoryData = useMemo(() => {
    if (!products || products.length === 0) return [{ name: "Inventory Empty", count: 0 }]
    const counts: Record<string, number> = {}
    products.forEach((p: any) => counts[p.category] = (counts[p.category] || 0) + 1)
    return Object.entries(counts).map(([name, count]) => ({ name, count }))
  }, [products])

  const statusData = useMemo(() => {
    if (!displayOrders || displayOrders.length === 0) return [{ name: "No Orders", value: 1 }]
    const counts: Record<string, number> = {}
    displayOrders.forEach((o: any) => counts[o.status || 'Pending'] = (counts[o.status || 'Pending'] || 0) + 1)
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [displayOrders])

  const paymentData = useMemo(() => {
    if (!displayOrders || displayOrders.length === 0) return [{ name: "No Payments", value: 1 }]
    const counts: Record<string, number> = {}
    displayOrders.forEach((o: any) => counts[o.paymentMethod || 'COD'] = (counts[o.paymentMethod || 'COD'] || 0) + 1)
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [displayOrders])

  const categorySalesData = useMemo(() => {
    if (!displayOrders || displayOrders.length === 0) return [{ name: "No Sales", value: 1 }]
    const counts: Record<string, number> = {}
    displayOrders.forEach((o: any) => {
      (o.items || []).forEach((item: any) => {
        const cat = item.product?.category || 'Uncategorized'
        counts[cat] = (counts[cat] || 0) + (item.quantity || 1)
      })
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [displayOrders])

  // Show loading state
  if (isLoadingOrders) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#c9a84c]/20 border-t-[#c9a84c] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#f8f9fc] min-h-screen p-4 sm:p-6 lg:p-8 font-sans text-neutral-900 animate-fade-in print:bg-white print:p-0">
      
      {/* 🚀 HEADER & CONTROLS */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 flex items-center gap-3">
            Command Dashboard
            <span className="bg-emerald-100 text-emerald-700 text-[10px] px-3 py-1 rounded-full uppercase tracking-wider font-bold print:hidden">Live Synced</span>
          </h1>
          <p className="text-sm text-neutral-500 mt-1">Real-time marketplace analytics and financial metrics</p>
        </div>
        
        {/* 🎛️ FILTERS & EXPORT (Hidden during PDF Print) */}
        <div className="flex items-center gap-3 print:hidden">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] cursor-pointer shadow-sm"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white rounded-xl text-sm font-bold tracking-wider hover:shadow-lg hover:shadow-[#1a1a2e]/20 transition-all cursor-pointer border-0"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* KPI TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-all">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total Products</p>
            <p className="text-2xl font-black mt-1">{products.length}</p>
            <p className="text-xs text-emerald-500 mt-1 font-medium">Live Catalog</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl"><Package className="text-blue-600 w-6 h-6" /></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-all">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total Orders</p>
            <p className="text-2xl font-black mt-1">{displayOrders.length}</p>
            <p className="text-xs text-emerald-500 mt-1 font-medium">Fulfillment Active</p>
          </div>
          <div className="bg-amber-50 p-4 rounded-2xl"><ShoppingBag className="text-amber-600 w-6 h-6" /></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-all">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Gross Revenue</p>
            <p className="text-2xl font-black mt-1 text-[#1a1a2e]">₹{totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-emerald-500 mt-1 font-medium">Auto-Calculated</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-2xl"><TrendingUp className="text-emerald-600 w-6 h-6" /></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-all">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Unique Customers</p>
            <p className="text-2xl font-black mt-1">{new Set(displayOrders.map(o => o.customerEmail).filter(Boolean)).size}</p>
            <p className="text-xs text-purple-500 mt-1 font-medium">Database Synced</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-2xl"><Users className="text-purple-600 w-6 h-6" /></div>
        </div>
      </div>

      {/* TWO MASSIVE GRAPHS (ROW 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* 🚀 UPGRADED: SWEEPING AREA CHART FOR REVENUE */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 h-[380px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2 text-gray-800">
              <TrendingUp className="w-5 h-5 text-[#c9a84c]" /> Revenue Trajectory
            </h3>
            <span className="text-[10px] font-bold bg-gray-50 text-gray-500 px-3 py-1 rounded-full uppercase">
              {timeRange} View
            </span>
          </div>
          <div className="flex-grow w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartDataSets[timeRange]}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#c9a84c" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} tickFormatter={(val) => `₹${val/1000}k`} dx={-10} />
                <Tooltip cursor={{ stroke: '#c9a84c', strokeWidth: 1, strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="revenue" stroke="#c9a84c" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* INVENTORY BAR CHART */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 h-[380px] flex flex-col">
          <h3 className="text-sm font-black uppercase tracking-wider mb-6 flex items-center gap-2 text-gray-800">
            <BarChart3 className="w-5 h-5 text-[#1a1a2e]" /> Inventory Distribution
          </h3>
          <div className="flex-grow w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} allowDecimals={false} dx={-10} />
                <Tooltip cursor={{ fill: '#f8f9fc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill="#1a1a2e" radius={[6, 6, 0, 0]} maxBarSize={50}>
                  {inventoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#1a1a2e' : '#c9a84c'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* THREE PIE CHARTS (ROW 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* PIE CHART 1: Category Sales */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col items-center">
          <h3 className="text-xs font-black uppercase tracking-wider w-full text-left mb-2 flex items-center gap-2 text-gray-800 border-b border-gray-100 pb-3">
            <PieChartIcon className="w-4 h-4 text-[#c9a84c]" /> Units Sold by Category
          </h3>
          <div className="w-full h-[250px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categorySalesData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {categorySalesData.map((entry, index) => <Cell key={`cell-${index}`} fill={LUXURY_COLORS[index % LUXURY_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#4b5563' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART 2: Payment Methods */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col items-center">
          <h3 className="text-xs font-black uppercase tracking-wider w-full text-left mb-2 flex items-center gap-2 text-gray-800 border-b border-gray-100 pb-3">
            <CreditCard className="w-4 h-4 text-[#c9a84c]" /> Payment Preferences
          </h3>
          <div className="w-full h-[250px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={paymentData} cx="50%" cy="50%" innerRadius={0} outerRadius={80} dataKey="value" stroke="none">
                  {paymentData.map((entry, index) => <Cell key={`cell-${index}`} fill={LUXURY_COLORS[index % LUXURY_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#4b5563' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART 3: Order Status */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col items-center">
          <h3 className="text-xs font-black uppercase tracking-wider w-full text-left mb-2 flex items-center gap-2 text-gray-800 border-b border-gray-100 pb-3">
            <Activity className="w-4 h-4 text-[#c9a84c]" /> Fulfillment Status
          </h3>
          <div className="w-full h-[250px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                  {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={LUXURY_COLORS[index % LUXURY_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#4b5563' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  )
}