import { useEffect, useState } from "react";
import { 
  CreditCard, 
  DollarSign, 
  Filter, 
  Search, 
  RefreshCw, 
  ChevronDown,
  Calendar,
  User,
  Hash,
  Banknote,
  Check,
  X,
  Clock,
  AlertCircle
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../utils/api";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingStatus, setUpdatingStatus] = useState({});

  const itemsPerPage = 10;

  useEffect(() => {
    fetchPayments();
    
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    }
  }, [currentPage]);

  useEffect(() => {
    filterPayments();
  }, [payments, searchTerm, statusFilter]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/payments?page=${currentPage}&limit=${itemsPerPage}`);
      setPayments(response.data.payments || []);
      setTotalPages(Math.ceil((response.data.total || 0) / itemsPerPage));
    } catch (error) {
      console.error("Error fetching payments:", error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const filterPayments = () => {
    let filtered = payments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(payment => 
        payment.paymentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    setFilteredPayments(filtered);
  };

  const handleStatusUpdate = async (paymentId, newStatus) => {
    setUpdatingStatus(prev => ({ ...prev, [paymentId]: true }));
    try {
      await API.put(`/payments/${paymentId}/status`, { status: newStatus });
      await fetchPayments(); // Refresh the payments list
    } catch (error) {
      console.error("Error updating payment status:", error);
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [paymentId]: false }));
    }
  };

  const getStatusBadgeColor = (status) => {
    if (darkMode) {
      switch(status?.toUpperCase()) {
        case 'PENDING': return 'bg-amber-900/50 text-amber-300 border border-amber-600/50';
        case 'COMPLETED': return 'bg-emerald-900/50 text-emerald-300 border border-emerald-600/50';
        case 'FAILED': return 'bg-red-900/50 text-red-300 border border-red-600/50';
        case 'REFUNDED': return 'bg-purple-900/50 text-purple-300 border border-purple-600/50';
        default: return 'bg-gray-800/50 text-gray-300 border border-gray-600/50';
      }
    } else {
      switch(status?.toUpperCase()) {
        case 'PENDING': return 'bg-amber-50 text-amber-700 border border-amber-200 shadow-sm';
        case 'COMPLETED': return 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm';
        case 'FAILED': return 'bg-red-50 text-red-700 border border-red-200 shadow-sm';
        case 'REFUNDED': return 'bg-purple-50 text-purple-700 border border-purple-200 shadow-sm';
        default: return 'bg-slate-50 text-slate-700 border border-slate-200 shadow-sm';
      }
    }
  };

  const getMethodIcon = (method) => {
    switch(method?.toLowerCase()) {
      case 'card':
        return <CreditCard className="h-4 w-4" />;
      case 'cod':
        return <Banknote className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toUpperCase()) {
      case 'COMPLETED':
        return <Check className="h-3 w-3" />;
      case 'FAILED':
        return <X className="h-3 w-3" />;
      case 'PENDING':
        return <Clock className="h-3 w-3" />;
      default:
        return <AlertCircle className="h-3 w-3" />;
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
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent`}>
                      Payments
                    </h1>
                    <p className={`text-sm sm:text-base ${
                      darkMode ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      Manage and track all payment transactions
                    </p>
                  </div>
                </div>
                
                {/* Search and Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                      darkMode ? 'text-gray-400' : 'text-slate-400'
                    }`} />
                    <input
                      type="text"
                      placeholder="Search by user name or order ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border transition-all duration-200 ${
                        darkMode 
                          ? 'bg-gray-700/50 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-cyan-500' 
                          : 'bg-white/70 border-slate-200 text-slate-700 placeholder-slate-400 focus:border-cyan-500'
                      } focus:outline-none focus:ring-2 focus:ring-cyan-500/20`}
                    />
                  </div>
                  
                  {/* Status Filter */}
                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className={`appearance-none pl-4 pr-10 py-2.5 rounded-lg border transition-all duration-200 ${
                        darkMode 
                          ? 'bg-gray-700/50 border-gray-600 text-gray-200 focus:border-cyan-500' 
                          : 'bg-white/70 border-slate-200 text-slate-700 focus:border-cyan-500'
                      } focus:outline-none focus:ring-2 focus:ring-cyan-500/20`}
                    >
                      <option value="all">All Status</option>
                      <option value="PENDING">Pending</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="FAILED">Failed</option>
                      <option value="REFUNDED">Refunded</option>
                    </select>
                    <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none ${
                      darkMode ? 'text-gray-400' : 'text-slate-400'
                    }`} />
                  </div>
                  
                  {/* Refresh Button */}
                  <button
                    onClick={fetchPayments}
                    disabled={loading}
                    className={`px-4 py-2.5 rounded-lg border transition-all duration-200 flex items-center space-x-2 ${
                      darkMode 
                        ? 'bg-gray-700/50 border-gray-600 text-gray-200 hover:bg-gray-600/50' 
                        : 'bg-white/70 border-slate-200 text-slate-700 hover:bg-slate-50'
                    } focus:outline-none focus:ring-2 focus:ring-cyan-500/20`}
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Payments Table */}
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
                      <CreditCard className="h-5 w-5 text-white" />
                      <h2 className="text-lg sm:text-xl font-bold text-white">Payment Transactions</h2>
                    </div>
                    <span className="text-cyan-100 text-sm">
                      {filteredPayments.length} payment{filteredPayments.length !== 1 ? 's' : ''}
                    </span>
                  </div>
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
                          <div className="flex items-center space-x-1">
                            <Hash className="h-3 w-3" />
                            <span>Payment ID</span>
                          </div>
                        </th>
                        <th className={`px-4 sm:px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-b ${
                          darkMode 
                            ? 'text-gray-300 border-gray-600' 
                            : 'text-slate-600 border-slate-200'
                        }`}>
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>User</span>
                          </div>
                        </th>
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
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-3 w-3" />
                            <span>Amount</span>
                          </div>
                        </th>
                        <th className={`px-4 sm:px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-b ${
                          darkMode 
                            ? 'text-gray-300 border-gray-600' 
                            : 'text-slate-600 border-slate-200'
                        }`}>
                          Method
                        </th>
                        <th className={`px-4 sm:px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-b ${
                          darkMode 
                            ? 'text-gray-300 border-gray-600' 
                            : 'text-slate-600 border-slate-200'
                        }`}>
                          Status
                        </th>
                        <th className={`px-4 sm:px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-b ${
                          darkMode 
                            ? 'text-gray-300 border-gray-600' 
                            : 'text-slate-600 border-slate-200'
                        }`}>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>Date</span>
                          </div>
                        </th>
                        <th className={`px-4 sm:px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-b ${
                          darkMode 
                            ? 'text-gray-300 border-gray-600' 
                            : 'text-slate-600 border-slate-200'
                        }`}>
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`backdrop-blur-sm divide-y ${
                      darkMode 
                        ? 'bg-gray-800/50 divide-gray-600' 
                        : 'bg-white/50 divide-slate-100'
                    }`}>
                      {loading ? (
                        <tr>
                          <td colSpan={8} className="px-6 py-12 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <RefreshCw className="h-5 w-5 animate-spin text-cyan-500" />
                              <span className={`${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                                Loading payments...
                              </span>
                            </div>
                          </td>
                        </tr>
                      ) : filteredPayments.length === 0 ? (
                        <tr>
                          <td colSpan={8} className={`px-6 py-12 text-center ${
                            darkMode ? 'text-gray-400' : 'text-slate-500'
                          }`}>
                            <div className="flex flex-col items-center space-y-3">
                              <CreditCard className="h-12 w-12 text-slate-300" />
                              <div>
                                <p className="font-medium">No payments found</p>
                                <p className="text-sm">Try adjusting your search or filter criteria</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredPayments.map((payment) => (
                          <tr key={payment._id} className={`transition-all duration-200 ${
                            darkMode 
                              ? 'hover:bg-gray-700/30' 
                              : 'hover:bg-cyan-50/50'
                          }`}>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <span className={`text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full ${
                                darkMode 
                                  ? 'text-cyan-300 bg-cyan-900/30 border border-cyan-600/30' 
                                  : 'text-cyan-700 bg-cyan-100 border border-cyan-200'
                              }`}>
                                {payment.paymentId || `PAY-${payment._id?.slice(-4)}`}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                                  <span className="text-white font-bold text-xs">
                                    {payment.userId?.name?.charAt(0)?.toUpperCase() || 'U'}
                                  </span>
                                </div>
                                <span className={`text-xs sm:text-sm font-semibold ${
                                  darkMode ? 'text-gray-200' : 'text-slate-700'
                                }`}>
                                  {payment.userId?.name || 'Unknown User'}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <span className={`text-xs sm:text-sm font-mono ${
                                darkMode ? 'text-gray-300' : 'text-slate-600'
                              }`}>
                                {payment.orderId || `ORD-${payment._id?.slice(-4)}`}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <span className={`text-sm font-bold ${
                                darkMode ? 'text-gray-200' : 'text-slate-700'
                              }`}>
                                ₦{payment.amount?.toLocaleString() || '0'}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <div className={`p-1.5 rounded-lg ${
                                  darkMode ? 'bg-gray-700/50' : 'bg-slate-100'
                                }`}>
                                  {getMethodIcon(payment.method)}
                                </div>
                                <span className={`text-xs sm:text-sm font-medium capitalize ${
                                  darkMode ? 'text-gray-300' : 'text-slate-600'
                                }`}>
                                  {payment.method || 'N/A'}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-1">
                                <span className={`inline-flex items-center space-x-1 px-2 sm:px-3 py-1 text-xs font-bold rounded-full ${getStatusBadgeColor(payment.status)}`}>
                                  {getStatusIcon(payment.status)}
                                  <span>{payment.status || 'PENDING'}</span>
                                </span>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <span className={`text-xs sm:text-sm ${
                                darkMode ? 'text-gray-400' : 'text-slate-500'
                              }`}>
                                {payment.createdAt 
                                  ? new Date(payment.createdAt).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })
                                  : 'N/A'
                                }
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="relative">
                                <select
                                  value={payment.status || 'PENDING'}
                                  onChange={(e) => handleStatusUpdate(payment._id, e.target.value)}
                                  disabled={updatingStatus[payment._id]}
                                  className={`text-xs px-2 py-1 rounded-lg border transition-all duration-200 ${
                                    darkMode 
                                      ? 'bg-gray-700/50 border-gray-600 text-gray-200' 
                                      : 'bg-white border-slate-200 text-slate-700'
                                  } focus:outline-none focus:ring-2 focus:ring-cyan-500/20 ${
                                    updatingStatus[payment._id] ? 'opacity-50 cursor-not-allowed' : ''
                                  }`}
                                >
                                  <option value="PENDING">Pending</option>
                                  <option value="COMPLETED">Completed</option>
                                  <option value="FAILED">Failed</option>
                                  <option value="REFUNDED">Refunded</option>
                                </select>
                                {updatingStatus[payment._id] && (
                                  <RefreshCw className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 animate-spin text-cyan-500" />
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className={`px-4 sm:px-6 py-4 border-t flex items-center justify-between ${
                    darkMode ? 'border-gray-600 bg-gray-800/30' : 'border-slate-200 bg-slate-50/30'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 text-sm rounded-lg border transition-all duration-200 ${
                          currentPage === 1 
                            ? (darkMode ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed' : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed')
                            : (darkMode ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50')
                        }`}
                      >
                        Previous
                      </button>
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 text-sm rounded-lg border transition-all duration-200 ${
                          currentPage === totalPages 
                            ? (darkMode ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed' : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed')
                            : (darkMode ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50')
                        }`}
                      >
                        Next
                      </button>
                    </div>
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