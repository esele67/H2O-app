import { useEffect, useState } from "react";
import { TrendingUp, ShoppingCart, Clock, DollarSign, Droplets, Waves } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../utils/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    statusCounts: [],
  });

  
  const [recentOrders, setRecentOrders] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchRecentOrders();
    
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  const fetchStats = async () => {
    const res = await API.get("/orders/admin/stats");
    setStats(res.data);
  };

  const fetchRecentOrders = async () => {
    const res = await API.get("/orders/admin/all?page=1&limit=5");
    setRecentOrders(res.data.orders);
  };

  // helper to get count by status
  const getStatusCount = (status) => {
    const found = stats.statusCounts.find((s) => s._id === status);
    return found ? found.count : 0;
  };

  const getStatusBadgeColor = (status) => {
    if (darkMode) {
      switch(status) {
        case 'PENDING': return 'bg-amber-900/50 text-amber-300 border border-amber-600/50';
        case 'CONFIRMED': return 'bg-cyan-900/50 text-cyan-300 border border-cyan-600/50';
        case 'DELIVERED': return 'bg-emerald-900/50 text-emerald-300 border border-emerald-600/50';
        case 'CANCELLED': return 'bg-red-900/50 text-red-300 border border-red-600/50';
        default: return 'bg-gray-800/50 text-gray-300 border border-gray-600/50';
      }
    } else {
      switch(status) {
        case 'PENDING': return 'bg-amber-50 text-amber-700 border border-amber-200 shadow-sm';
        case 'CONFIRMED': return 'bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-sm';
        case 'DELIVERED': return 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm';
        case 'CANCELLED': return 'bg-red-50 text-red-700 border border-red-200 shadow-sm';
        default: return 'bg-slate-50 text-slate-700 border border-slate-200 shadow-sm';
      }
    }
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
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-md">
                    <Droplets className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent`}>
                      Dashboard
                    </h1>
                    <p className={`text-sm sm:text-base ${
                      darkMode ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      Welcome to <span className="font-semibold text-cyan-600">Rainal Global Limited</span> - Managing water resources efficiently
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
              {/* Total Orders Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className={`relative backdrop-blur-sm rounded-xl shadow-lg border p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                  darkMode 
                    ? 'bg-gray-800/90 border-gray-700/20' 
                    : 'bg-white/90 border-white/20'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
                        darkMode ? 'text-gray-400' : 'text-slate-500'
                      }`}>Total Orders</p>
                      <p className={`text-2xl sm:text-3xl font-bold ${
                        darkMode ? 'text-white' : 'text-slate-800'
                      }`}>{stats.totalOrders}</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-3 w-3 text-emerald-500 mr-1" />
                        <span className="text-xs text-emerald-600 font-medium">Active orders</span>
                      </div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-md">
                      <ShoppingCart className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Revenue Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className={`relative backdrop-blur-sm rounded-xl shadow-lg border p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                  darkMode 
                    ? 'bg-gray-800/90 border-gray-700/20' 
                    : 'bg-white/90 border-white/20'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
                        darkMode ? 'text-gray-400' : 'text-slate-500'
                      }`}>Total Revenue</p>
                      <p className={`text-2xl sm:text-3xl font-bold ${
                        darkMode ? 'text-white' : 'text-slate-800'
                      }`}>₦{stats.totalRevenue.toLocaleString()}</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-3 w-3 text-emerald-500 mr-1" />
                        <span className="text-xs text-emerald-600 font-medium">This month</span>
                      </div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-md">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending Orders Card */}
              <div className="group relative sm:col-span-2 lg:col-span-1">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className={`relative backdrop-blur-sm rounded-xl shadow-lg border p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                  darkMode 
                    ? 'bg-gray-800/90 border-gray-700/20' 
                    : 'bg-white/90 border-white/20'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
                        darkMode ? 'text-gray-400' : 'text-slate-500'
                      }`}>Pending Orders</p>
                      <p className={`text-2xl sm:text-3xl font-bold ${
                        darkMode ? 'text-white' : 'text-slate-800'
                      }`}>{getStatusCount("PENDING")}</p>
                      <div className="flex items-center mt-2">
                        <Clock className="h-3 w-3 text-amber-500 mr-1" />
                        <span className="text-xs text-amber-600 font-medium">Awaiting action</span>
                      </div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-md">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Recent Orders Table */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-blue-500/5 to-teal-400/5 rounded-2xl blur-2xl"></div>
              <div className={`relative backdrop-blur-sm rounded-xl shadow-xl border overflow-hidden ${
                darkMode 
                  ? 'bg-gray-800/90 border-gray-700/20' 
                  : 'bg-white/90 border-white/20'
              }`}>
                <div className="bg-gradient-to-r from-cyan-600 to-blue-700 px-4 sm:px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Waves className="h-5 w-5 text-white" />
                    <h2 className="text-lg sm:text-xl font-bold text-white">Recent Water Orders</h2>
                  </div>
                  <p className="text-cyan-100 mt-1 text-sm">Latest customer water delivery requests</p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={`backdrop-blur-sm ${
                      darkMode ? 'bg-gray-700/50' : 'bg-slate-50/80'
                    }`}>
                      <tr>
                        <th className={`px-4 sm:px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-b ${
                          darkMode 
                            ? 'text-gray-300 border-gray-600' 
                            : 'text-slate-600 border-slate-200'
                        }`}>
                          Order ID
                        </th>
                        <th className={`px-4 sm:px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-b ${
                          darkMode 
                            ? 'text-gray-300 border-gray-600' 
                            : 'text-slate-600 border-slate-200'
                        }`}>
                          Customer
                        </th>
                        <th className={`px-4 sm:px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-b ${
                          darkMode 
                            ? 'text-gray-300 border-gray-600' 
                            : 'text-slate-600 border-slate-200'
                        }`}>
                          Water Products
                        </th>
                        <th className={`px-4 sm:px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-b ${
                          darkMode 
                            ? 'text-gray-300 border-gray-600' 
                            : 'text-slate-600 border-slate-200'
                        }`}>
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`backdrop-blur-sm divide-y ${
                      darkMode 
                        ? 'bg-gray-800/50 divide-gray-600' 
                        : 'bg-white/50 divide-slate-100'
                    }`}>
                      {recentOrders.map((o) => {
                        return (
                          <tr key={o._id} className={`transition-all duration-200 ${
                            darkMode 
                              ? 'hover:bg-gray-700/30' 
                              : 'hover:bg-cyan-50/50'
                          }`}>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <span className={`text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full ${
                                darkMode 
                                  ? 'text-gray-200 bg-gray-700' 
                                  : 'text-slate-800 bg-slate-100'
                              }`}>
                                #{o.orderId}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                                  <span className="text-white font-bold text-xs">
                                    {o.userId?.name?.charAt(0)?.toUpperCase() || 'U'}
                                  </span>
                                </div>
                                <span className={`text-xs sm:text-sm font-semibold ${
                                  darkMode ? 'text-gray-200' : 'text-slate-700'
                                }`}>{o.userId?.name || 'Unknown Customer'}</span>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4">
                              <div className="space-y-1">
                                {o.items.slice(0, 2).map((i) => (
                                  <div key={i._id} className="flex items-center space-x-1 sm:space-x-2">
                                    <Droplets className="h-3 w-3 text-cyan-500" />
                                    <span className={`text-xs sm:text-sm font-medium truncate max-w-24 sm:max-w-32 ${
                                      darkMode ? 'text-gray-200' : 'text-slate-700'
                                    }`}>{i.productId?.name}</span>
                                    <span className={`text-xs px-1 sm:px-2 py-1 rounded-full ${
                                      darkMode 
                                        ? 'text-gray-400 bg-gray-700' 
                                        : 'text-slate-500 bg-slate-100'
                                    }`}>
                                      ×{i.quantity}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 sm:px-3 py-1 text-xs font-bold rounded-full ${getStatusBadgeColor(o.status)}`}>
                                {o.status}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                
                {recentOrders.length === 0 && (
                  <div className={`text-center py-12 sm:py-16 ${
                    darkMode 
                      ? 'bg-gradient-to-br from-gray-800 to-gray-700' 
                      : 'bg-gradient-to-br from-slate-50 to-cyan-50'
                  }`}>
                    <div className="text-slate-400 mb-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mb-4 shadow-xl">
                        <ShoppingCart className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                      </div>
                    </div>
                    <h3 className={`text-lg sm:text-xl font-bold mb-2 ${
                      darkMode ? 'text-gray-200' : 'text-slate-700'
                    }`}>No recent water orders</h3>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-slate-500'
                    }`}>Water delivery orders will appear here when customers place them</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}