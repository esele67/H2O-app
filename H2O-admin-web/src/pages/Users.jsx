import { useEffect, useState } from "react";
import { 
  Users as UsersIcon, 
  Search, 
  RefreshCw, 
  ChevronDown,
  Calendar,
  Mail,
  Phone,
  Shield,
  ShoppingBag,
  DollarSign,
  Eye,
  X,
  UserCheck,
  UserX,
  Star,
  TrendingUp,
  Package,
  Clock
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../utils/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState({});

  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
    
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    }
  }, [currentPage, sortBy]);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/users?page=${currentPage}&limit=${itemsPerPage}&sort=${sortBy}`);
      setUsers(response.data.users || []);
      setTotalPages(Math.ceil((response.data.total || 0) / itemsPerPage));
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const fetchUserProfile = async (userId) => {
    try {
      const response = await API.get(`/users/${userId}`);
      setSelectedUser(response.data);
      
      // Fetch user orders
      const ordersResponse = await API.get(`/users/${userId}/orders?limit=5`);
      setUserOrders(ordersResponse.data.orders || []);
      
      setShowUserModal(true);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleStatusUpdate = async (userId, newStatus) => {
    setUpdatingStatus(prev => ({ ...prev, [userId]: true }));
    try {
      await API.put(`/users/${userId}/status`, { status: newStatus });
      await fetchUsers(); // Refresh the users list
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [userId]: false }));
    }
  };

  const closeModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
    setUserOrders([]);
  };

  const getStatusBadgeColor = (status) => {
    if (darkMode) {
      switch(status?.toLowerCase()) {
        case 'active': return 'bg-emerald-900/50 text-emerald-300 border border-emerald-600/50';
        case 'blocked': return 'bg-red-900/50 text-red-300 border border-red-600/50';
        default: return 'bg-gray-800/50 text-gray-300 border border-gray-600/50';
      }
    } else {
      switch(status?.toLowerCase()) {
        case 'active': return 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm';
        case 'blocked': return 'bg-red-50 text-red-700 border border-red-200 shadow-sm';
        default: return 'bg-slate-50 text-slate-700 border border-slate-200 shadow-sm';
      }
    }
  };

  const getOrderStatusBadgeColor = (status) => {
    if (darkMode) {
      switch(status) {
        case 'PENDING': return 'bg-amber-900/50 text-amber-300';
        case 'CONFIRMED': return 'bg-cyan-900/50 text-cyan-300';
        case 'DELIVERED': return 'bg-emerald-900/50 text-emerald-300';
        case 'CANCELLED': return 'bg-red-900/50 text-red-300';
        default: return 'bg-gray-800/50 text-gray-300';
      }
    } else {
      switch(status) {
        case 'PENDING': return 'bg-amber-50 text-amber-700';
        case 'CONFIRMED': return 'bg-cyan-50 text-cyan-700';
        case 'DELIVERED': return 'bg-emerald-50 text-emerald-700';
        case 'CANCELLED': return 'bg-red-50 text-red-700';
        default: return 'bg-slate-50 text-slate-700';
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
                    <UsersIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent`}>
                      Users
                    </h1>
                    <p className={`text-sm sm:text-base ${
                      darkMode ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      Manage registered users and view customer analytics
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
                      placeholder="Search by name, email or phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border transition-all duration-200 ${
                        darkMode 
                          ? 'bg-gray-700/50 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-cyan-500' 
                          : 'bg-white/70 border-slate-200 text-slate-700 placeholder-slate-400 focus:border-cyan-500'
                      } focus:outline-none focus:ring-2 focus:ring-cyan-500/20`}
                    />
                  </div>
                  
                  {/* Sort Filter */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className={`appearance-none pl-4 pr-10 py-2.5 rounded-lg border transition-all duration-200 ${
                        darkMode 
                          ? 'bg-gray-700/50 border-gray-600 text-gray-200 focus:border-cyan-500' 
                          : 'bg-white/70 border-slate-200 text-slate-700 focus:border-cyan-500'
                      } focus:outline-none focus:ring-2 focus:ring-cyan-500/20`}
                    >
                      <option value="newest">Newest First</option>
                      <option value="mostOrders">Most Orders</option>
                      <option value="totalSpent">Highest Spender</option>
                    </select>
                    <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none ${
                      darkMode ? 'text-gray-400' : 'text-slate-400'
                    }`} />
                  </div>
                  
                  {/* Refresh Button */}
                  <button
                    onClick={fetchUsers}
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

            {/* Users Table */}
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
                      <UsersIcon className="h-5 w-5 text-white" />
                      <h2 className="text-lg sm:text-xl font-bold text-white">Registered Users</h2>
                    </div>
                    <span className="text-cyan-100 text-sm">
                      {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
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
                          User
                        </th>
                        <th className={`px-4 sm:px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-b ${
                          darkMode 
                            ? 'text-gray-300 border-gray-600' 
                            : 'text-slate-600 border-slate-200'
                        }`}>
                          Contact
                        </th>
                        <th className={`px-4 sm:px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-b ${
                          darkMode 
                            ? 'text-gray-300 border-gray-600' 
                            : 'text-slate-600 border-slate-200'
                        }`}>
                          <div className="flex items-center space-x-1">
                            <ShoppingBag className="h-3 w-3" />
                            <span>Orders</span>
                          </div>
                        </th>
                        <th className={`px-4 sm:px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-b ${
                          darkMode 
                            ? 'text-gray-300 border-gray-600' 
                            : 'text-slate-600 border-slate-200'
                        }`}>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-3 w-3" />
                            <span>Total Spent</span>
                          </div>
                        </th>
                        <th className={`px-4 sm:px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-b ${
                          darkMode 
                            ? 'text-gray-300 border-gray-600' 
                            : 'text-slate-600 border-slate-200'
                        }`}>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>Joined</span>
                          </div>
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
                          <td colSpan={7} className="px-6 py-12 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <RefreshCw className="h-5 w-5 animate-spin text-cyan-500" />
                              <span className={`${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                                Loading users...
                              </span>
                            </div>
                          </td>
                        </tr>
                      ) : filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={7} className={`px-6 py-12 text-center ${
                            darkMode ? 'text-gray-400' : 'text-slate-500'
                          }`}>
                            <div className="flex flex-col items-center space-y-3">
                              <UsersIcon className="h-12 w-12 text-slate-300" />
                              <div>
                                <p className="font-medium">No users found</p>
                                <p className="text-sm">Try adjusting your search criteria</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user._id} className={`transition-all duration-200 ${
                            darkMode 
                              ? 'hover:bg-gray-700/30' 
                              : 'hover:bg-cyan-50/50'
                          }`}>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className="relative">
                                  {user.avatar ? (
                                    <img 
                                      src={user.avatar} 
                                      alt={user.name}
                                      className="w-10 h-10 rounded-full object-cover shadow-md"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                                      <span className="text-white font-bold text-sm">
                                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                      </span>
                                    </div>
                                  )}
                                  {(user.orderCount || 0) > 10 && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                      <Star className="h-2 w-2 text-white" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className={`text-sm font-semibold ${
                                    darkMode ? 'text-gray-200' : 'text-slate-700'
                                  }`}>
                                    {user.name || 'Unknown User'}
                                  </p>
                                  <p className={`text-xs ${
                                    darkMode ? 'text-gray-400' : 'text-slate-500'
                                  }`}>
                                    ID: {user._id?.slice(-6)}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <Mail className="h-3 w-3 text-slate-400" />
                                  <span className={`text-xs ${
                                    darkMode ? 'text-gray-300' : 'text-slate-600'
                                  }`}>
                                    {user.email || 'No email'}
                                  </span>
                                </div>
                                {user.phone && (
                                  <div className="flex items-center space-x-2">
                                    <Phone className="h-3 w-3 text-slate-400" />
                                    <span className={`text-xs ${
                                      darkMode ? 'text-gray-300' : 'text-slate-600'
                                    }`}>
                                      {user.phone}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <div className={`p-1.5 rounded-lg ${
                                  darkMode ? 'bg-gray-700/50' : 'bg-slate-100'
                                }`}>
                                  <Package className="h-3 w-3 text-cyan-500" />
                                </div>
                                <span className={`text-sm font-bold ${
                                  darkMode ? 'text-gray-200' : 'text-slate-700'
                                }`}>
                                  {user.orderCount || 0}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <span className={`text-sm font-bold ${
                                darkMode ? 'text-gray-200' : 'text-slate-700'
                              }`}>
                                ₦{(user.totalSpent || 0).toLocaleString()}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <span className={`text-xs ${
                                darkMode ? 'text-gray-400' : 'text-slate-500'
                              }`}>
                                {user.joinedAt || user.createdAt
                                  ? new Date(user.joinedAt || user.createdAt).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })
                                  : 'N/A'
                                }
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center space-x-1 px-2 sm:px-3 py-1 text-xs font-bold rounded-full ${getStatusBadgeColor(user.status || 'active')}`}>
                                {(user.status || 'active') === 'active' ? (
                                  <UserCheck className="h-3 w-3" />
                                ) : (
                                  <UserX className="h-3 w-3" />
                                )}
                                <span className="capitalize">{user.status || 'active'}</span>
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => fetchUserProfile(user._id)}
                                  className={`p-1.5 rounded-lg border transition-all duration-200 ${
                                    darkMode 
                                      ? 'bg-gray-700/50 border-gray-600 text-gray-200 hover:bg-gray-600/50' 
                                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                  }`}
                                  title="View Profile"
                                >
                                  <Eye className="h-3 w-3" />
                                </button>
                                <select
                                  value={user.status || 'active'}
                                  onChange={(e) => handleStatusUpdate(user._id, e.target.value)}
                                  disabled={updatingStatus[user._id]}
                                  className={`text-xs px-2 py-1 rounded-lg border transition-all duration-200 ${
                                    darkMode 
                                      ? 'bg-gray-700/50 border-gray-600 text-gray-200' 
                                      : 'bg-white border-slate-200 text-slate-700'
                                  } focus:outline-none focus:ring-2 focus:ring-cyan-500/20 ${
                                    updatingStatus[user._id] ? 'opacity-50 cursor-not-allowed' : ''
                                  }`}
                                >
                                  <option value="active">Active</option>
                                  <option value="blocked">Blocked</option>
                                </select>
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

      {/* User Profile Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-cyan-600 to-blue-700 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">User Profile</h3>
              <button
                onClick={closeModal}
                className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* User Info Section */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  {selectedUser.avatar ? (
                    <img 
                      src={selectedUser.avatar} 
                      alt={selectedUser.name}
                      className="w-20 h-20 rounded-full object-cover shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-2xl">
                        {selectedUser.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <div className={`absolute -bottom-1 -right-1 px-2 py-1 text-xs font-bold rounded-full ${getStatusBadgeColor(selectedUser.status || 'active')}`}>
                    {selectedUser.status || 'active'}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                    {selectedUser.name || 'Unknown User'}
                  </h4>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                    {selectedUser.email}
                  </p>
                  {selectedUser.phone && (
                    <p className={`${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      {selectedUser.phone}
                    </p>
                  )}
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                    Joined: {selectedUser.joinedAt 
                      ? new Date(selectedUser.joinedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'Unknown'
                    }
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-slate-50'}`}>
                  <div className="flex items-center space-x-2">
                    <ShoppingBag className="h-5 w-5 text-cyan-500" />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>Total Orders</span>
                  </div>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                    {selectedUser.orderCount || 0}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-slate-50'}`}>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-emerald-500" />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>Total Spent</span>
                  </div>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                    ₦{(selectedUser.totalSpent || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Recent Orders */}
              <div>
                <h5 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                  Recent Orders (Last 5)
                </h5>
                {userOrders.length === 0 ? (
                  <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                    No recent orders found
                  </p>
                ) : (
                  <div className="space-y-2">
                    {userOrders.map((order) => (
                      <div key={order._id} className={`p-3 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700/30 border-gray-600' 
                          : 'bg-slate-50 border-slate-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className={`text-sm font-bold px-2 py-1 rounded ${
                              darkMode ? 'bg-gray-600 text-gray-200' : 'bg-slate-200 text-slate-700'
                            }`}>
                              #{order.orderId || order._id?.slice(-6)}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${getOrderStatusBadgeColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                              ₦{(order.total || 0).toLocaleString()}
                            </p>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                              {order.createdAt 
                                ? new Date(order.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                  })
                                : 'N/A'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}