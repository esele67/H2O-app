import { useEffect, useState } from "react";
import { ShoppingBag, User, Package, ChevronLeft, ChevronRight, Filter, Search, Droplets, Waves, MapPin, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../utils/api";
import { Loader2 } from "lucide-react";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const limit = 10;

  useEffect(() => {
    fetchOrders(page);
    
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    }
  }, [page, searchTerm, statusFilter]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  const fetchOrders = async (pageNum = 1) => {
    setLoading(true);
    try {
      let url = `/orders/admin/all?page=${pageNum}&limit=${limit}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
      if (statusFilter !== "ALL") url += `&status=${statusFilter}`;
      
      const res = await API.get(url);
      setOrders(res.data.orders);
      setTotalPages(res.data.totalPages);
      setPage(res.data.page);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status });
      fetchOrders(page);
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update order status");
    }
  };

  const handleViewOrder = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const getStatusColor = (status) => {
    if (darkMode) {
      switch(status) {
        case 'PENDING': return 'bg-amber-900/50 text-amber-300 border border-amber-600/50';
        case 'ACCEPTED': return 'bg-cyan-900/50 text-cyan-300 border border-cyan-600/50';
        case 'DISPATCHED': return 'bg-purple-900/50 text-purple-300 border border-purple-600/50';
        case 'DELIVERED': return 'bg-emerald-900/50 text-emerald-300 border border-emerald-600/50';
        case 'CANCELLED': return 'bg-red-900/50 text-red-300 border border-red-600/50';
        default: return 'bg-gray-800/50 text-gray-300 border border-gray-600/50';
      }
    } else {
      switch(status) {
        case 'PENDING': return 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-200/50 shadow-sm';
        case 'ACCEPTED': return 'bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 border border-cyan-200/50 shadow-sm';
        case 'DISPATCHED': return 'bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 border border-purple-200/50 shadow-sm';
        case 'DELIVERED': return 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-200/50 shadow-sm';
        case 'CANCELLED': return 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200/50 shadow-sm';
        default: return 'bg-gradient-to-r from-slate-50 to-gray-50 text-slate-700 border border-slate-200/50 shadow-sm';
      }
    }
  };

  const getTotalPrice = (items) => {
    return items.reduce((total, item) => {
      const price = item.productId?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setPage(1);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50'
    }`}>
      <Navbar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        darkMode={darkMode}
      />
      
      <div className={`transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
      } pt-16`}>
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Header Section */}
            <div className="mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-blue-500/10 to-teal-400/10 rounded-2xl blur-3xl"></div>
              <div className={`relative backdrop-blur-sm rounded-xl p-4 sm:p-6 border shadow-lg ${
                darkMode 
                  ? 'bg-gray-800/80 border-gray-700/20' 
                  : 'bg-white/80 border-white/20'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-md">
                    <ShoppingBag className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
                      Water Orders
                    </h1>
                    <p className={`text-sm sm:text-base ${
                      darkMode ? 'text-gray-400' : 'text-slate-600'
                    }`}>Manage and track water delivery orders</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-blue-500/5 rounded-xl blur-xl"></div>
              <div className={`relative backdrop-blur-sm rounded-xl shadow-lg border ${
                darkMode 
                  ? 'bg-gray-800/90 border-gray-700/20' 
                  : 'bg-white/90 border-white/20'
              }`}>
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-slate-400'}`} />
                      </div>
                      <input
                        type="text"
                        placeholder="Search orders by ID or customer name..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className={`w-full pl-10 pr-3 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 backdrop-blur-sm transition-all duration-200 text-sm ${
                          darkMode 
                            ? 'border-gray-600 bg-gray-800/80 text-white placeholder-gray-400' 
                            : 'border-slate-200 bg-white/80 text-slate-700 placeholder-slate-400'
                        }`}
                      />
                    </div>

                    {/* Status Filter */}
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                      <div className={`flex items-center space-x-2 ${
                        darkMode ? 'text-gray-300' : 'text-slate-600'
                      }`}>
                        <Filter className="h-4 w-4 text-cyan-500" />
                        <span className="font-medium text-sm">Filter:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['ALL', 'PENDING', 'ACCEPTED', 'DISPATCHED', 'DELIVERED'].map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusFilter(status)}
                            className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm ${
                              statusFilter === status
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md transform scale-105'
                                : darkMode 
                                  ? 'bg-gray-700/80 text-gray-300 border border-gray-600 hover:bg-gray-600 hover:border-gray-500'
                                  : 'bg-white/80 text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-blue-500/5 to-teal-400/5 rounded-2xl blur-2xl"></div>
              <div className={`relative backdrop-blur-sm rounded-xl shadow-xl border overflow-hidden ${
                darkMode 
                  ? 'bg-gray-800/90 border-gray-700/20' 
                  : 'bg-white/90 border-white/20'
              }`}>
                <div className="bg-gradient-to-r from-cyan-600 to-blue-700 px-4 sm:px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Waves className="h-5 w-5 text-white" />
                      <h2 className="text-lg sm:text-xl font-bold text-white">Order Management</h2>
                    </div>
                    <div className="text-cyan-100 text-xs sm:text-sm font-medium">
                      {orders.length} {orders.length === 1 ? 'order' : 'orders'} found
                    </div>
                  </div>
                </div>
                
                {/* Table with Horizontal Scroll */}
                <div className="overflow-x-auto max-w-full">
                  <div className="min-w-full inline-block align-middle">
                    {loading ? (
                      <div className={`flex items-center justify-center py-16 sm:py-20 ${
                        darkMode 
                          ? 'bg-gradient-to-br from-gray-800 to-gray-700' 
                          : 'bg-gradient-to-br from-slate-50 to-cyan-50'
                      }`}>
                        <div className="text-center">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-xl">
                            <Loader2 className="animate-spin h-6 w-6 sm:h-8 sm:w-8 text-white" />
                          </div>
                          <span className={`font-medium text-sm ${
                            darkMode ? 'text-gray-300' : 'text-slate-600'
                          }`}>Loading water orders...</span>
                        </div>
                      </div>
                    ) : (
                      <table className="w-full">
                        <thead className={`backdrop-blur-sm ${
                          darkMode ? 'bg-gray-700/50' : 'bg-slate-50/80'
                        }`}>
                          <tr>
                            <th className={`px-3 sm:px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-b min-w-[120px] ${
                              darkMode 
                                ? 'text-gray-300 border-gray-600' 
                                : 'text-slate-600 border-slate-200'
                            }`}>
                              Order Details
                            </th>
                            <th className={`px-3 sm:px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-b min-w-[150px] ${
                              darkMode 
                                ? 'text-gray-300 border-gray-600' 
                                : 'text-slate-600 border-slate-200'
                            }`}>
                              Customer
                            </th>
                            <th className={`px-3 sm:px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-b min-w-[200px] ${
                              darkMode 
                                ? 'text-gray-300 border-gray-600' 
                                : 'text-slate-600 border-slate-200'
                            }`}>
                              Water Products
                            </th>
                            <th className={`px-3 sm:px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-b min-w-[100px] ${
                              darkMode 
                                ? 'text-gray-300 border-gray-600' 
                                : 'text-slate-600 border-slate-200'
                            }`}>
                              Total
                            </th>
                            <th className={`px-3 sm:px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-b min-w-[120px] ${
                              darkMode 
                                ? 'text-gray-300 border-gray-600' 
                                : 'text-slate-600 border-slate-200'
                            }`}>
                              Status
                            </th>
                            <th className={`px-3 sm:px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-b min-w-[200px] ${
                              darkMode 
                                ? 'text-gray-300 border-gray-600' 
                                : 'text-slate-600 border-slate-200'
                            }`}>
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className={`backdrop-blur-sm divide-y ${
                          darkMode 
                            ? 'bg-gray-800/50 divide-gray-600' 
                            : 'bg-white/50 divide-slate-100'
                        }`}>
                          {orders.map((o) => (
                            <tr key={o._id} className={`transition-all duration-200 ${
                              darkMode 
                                ? 'hover:bg-gray-700/30' 
                                : 'hover:bg-cyan-50/30'
                            }`}>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                <div className="space-y-1">
                                  <div className={`text-xs sm:text-sm font-bold px-2 py-1 rounded-full w-fit ${
                                    darkMode 
                                      ? 'text-gray-200 bg-gray-700' 
                                      : 'text-slate-800 bg-slate-100'
                                  }`}>
                                    #{o.orderId}
                                  </div>
                                  <div className={`text-xs font-medium ${
                                    darkMode ? 'text-gray-400' : 'text-slate-500'
                                  }`}>
                                    {new Date(o.createdAt).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </div>
                                </div>
                              </td>
                              
                              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-md">
                                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className={`text-xs sm:text-sm font-bold truncate ${
                                      darkMode ? 'text-gray-200' : 'text-slate-800'
                                    }`}>
                                      {o.userId?.name || "Unknown Customer"}
                                    </div>
                                    <div className={`text-xs flex items-center mt-1 ${
                                      darkMode ? 'text-gray-400' : 'text-slate-500'
                                    }`}>
                                      <MapPin className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                                      Water customer
                                    </div>
                                  </div>
                                </div>
                              </td>
                              
                              <td className="px-3 sm:px-6 py-3 sm:py-4">
                                <div className="space-y-1 max-w-xs">
                                  {o.items.slice(0, 2).map((i) => (
                                    <div key={i._id} className={`flex items-center space-x-1 sm:space-x-2 rounded-lg px-2 py-1 ${
                                      darkMode 
                                        ? 'bg-gray-700/50' 
                                        : 'bg-cyan-50/50'
                                    }`}>
                                      <Droplets className="h-3 w-3 text-cyan-500" />
                                      <span className={`text-xs sm:text-sm font-medium truncate flex-1 ${
                                        darkMode ? 'text-gray-200' : 'text-slate-700'
                                      }`}>
                                        {i.productId?.name || "Unknown Product"}
                                      </span>
                                      <span className={`text-xs px-1 sm:px-2 py-1 rounded-full font-semibold ${
                                        darkMode 
                                          ? 'text-gray-300 bg-gray-600' 
                                          : 'text-slate-500 bg-white'
                                      }`}>
                                        ×{i.quantity}
                                      </span>
                                    </div>
                                  ))}
                                  {o.items.length > 2 && (
                                    <div className={`text-xs font-medium px-2 py-1 rounded-lg ${
                                      darkMode 
                                        ? 'text-cyan-300 bg-cyan-900/50' 
                                        : 'text-cyan-600 bg-cyan-50'
                                    }`}>
                                      +{o.items.length - 2} more item{o.items.length - 2 !== 1 ? 's' : ''}
                                    </div>
                                  )}
                                </div>
                              </td>

                              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                <div className={`text-sm sm:text-lg font-bold px-2 sm:px-3 py-1 sm:py-2 rounded-lg border ${
                                  darkMode 
                                    ? 'text-emerald-300 bg-emerald-900/50 border-emerald-600' 
                                    : 'text-slate-800 bg-emerald-50 border-emerald-200'
                                }`}>
                                  ₦{getTotalPrice(o.items).toLocaleString()}
                                </div>
                              </td>
                              
                              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 sm:px-3 py-1 text-xs font-bold rounded-lg ${getStatusColor(o.status)}`}>
                                  {o.status}
                                </span>
                              </td>
                              
                              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleViewOrder(o._id)}
                                    className={`inline-flex items-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm ${
                                      darkMode 
                                        ? 'bg-cyan-900/50 text-cyan-300 border border-cyan-600/50 hover:bg-cyan-800/50' 
                                        : 'bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 border border-cyan-200/50 hover:from-cyan-100 hover:to-blue-100'
                                    }`}
                                    title="View Order Details"
                                  >
                                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                                    <span className="hidden sm:inline">View</span>
                                  </button>
                                  <select
                                    value={o.status}
                                    onChange={(e) => updateStatus(o._id, e.target.value)}
                                    className={`text-xs sm:text-sm border rounded-lg px-2 sm:px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 backdrop-blur-sm font-medium transition-all duration-200 ${
                                      darkMode 
                                        ? 'border-gray-600 bg-gray-700/90 text-gray-200 hover:bg-gray-600' 
                                        : 'border-slate-300 bg-white/90 text-slate-700 hover:bg-white'
                                    }`}
                                  >
                                    <option value="PENDING">PENDING</option>
                                    <option value="ACCEPTED">ACCEPTED</option>
                                    <option value="DISPATCHED">DISPATCHED</option>
                                    <option value="DELIVERED">DELIVERED</option>
                                  </select>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
                
                {!loading && orders.length === 0 && (
                  <div className={`text-center py-16 sm:py-20 ${
                    darkMode 
                      ? 'bg-gradient-to-br from-gray-800 to-gray-700' 
                      : 'bg-gradient-to-br from-slate-50 to-cyan-50'
                  }`}>
                    <div className="text-slate-400 mb-6">
                      <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mb-6 shadow-xl">
                        <ShoppingBag className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
                      </div>
                    </div>
                    <h3 className={`text-lg sm:text-2xl font-bold mb-4 ${
                      darkMode ? 'text-gray-200' : 'text-slate-700'
                    }`}>No water orders found</h3>
                    <p className={`text-sm sm:text-base max-w-md mx-auto ${
                      darkMode ? 'text-gray-400' : 'text-slate-500'
                    }`}>
                      {searchTerm || statusFilter !== "ALL" 
                        ? "Try adjusting your search or filter criteria to find water orders"
                        : "Water delivery orders will appear here when customers place them"
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="relative mt-6">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-blue-500/5 rounded-xl blur-xl"></div>
                <div className={`relative backdrop-blur-sm rounded-xl shadow-lg border ${
                  darkMode 
                    ? 'bg-gray-800/90 border-gray-700/20' 
                    : 'bg-white/90 border-white/20'
                }`}>
                  <div className="px-4 sm:px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div className={`text-sm font-medium ${
                        darkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>
                        Page <span className="font-bold text-cyan-600">{page}</span> of{' '}
                        <span className="font-bold text-cyan-600">{totalPages}</span>
                      </div>
                      
                      <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                        <button
                          disabled={page <= 1}
                          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                          className={`inline-flex items-center px-3 sm:px-4 py-2 border text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                            darkMode 
                              ? 'border-gray-600 text-gray-300 bg-gray-700/90 hover:bg-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500' 
                              : 'border-slate-300 text-slate-700 bg-white/90 hover:bg-slate-50 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500'
                          }`}
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Previous</span>
                        </button>

                        <div className="hidden md:flex items-center space-x-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (page <= 3) {
                              pageNum = i + 1;
                            } else if (page >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = page - 2 + i;
                            }
                            
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setPage(pageNum)}
                                className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                                  page === pageNum
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md transform scale-105'
                                    : darkMode 
                                      ? 'text-gray-300 hover:bg-gray-700 border border-gray-600'
                                      : 'text-slate-700 hover:bg-slate-100 border border-slate-200'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          disabled={page >= totalPages}
                          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                          className={`inline-flex items-center px-3 sm:px-4 py-2 border text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                            darkMode 
                              ? 'border-gray-600 text-gray-300 bg-gray-700/90 hover:bg-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500' 
                              : 'border-slate-300 text-slate-700 bg-white/90 hover:bg-slate-50 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500'
                          }`}
                        >
                          <span className="hidden sm:inline">Next</span>
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}