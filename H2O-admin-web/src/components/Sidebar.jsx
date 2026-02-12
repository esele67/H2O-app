import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Settings, 
  Users, 
  Droplets, 
  Waves,
  X,
  LogOut,
  Menu,
  ChevronLeft,
  CreditCard
} from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen, darkMode }) {
  const location = useLocation();
  const navigate = useNavigate();


  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      description: "Overview & Analytics"
    },
    {
      path: "/products",
      label: "Water Products",
      icon: Package,
      description: "Manage Inventory"
    },
    {
      path: "/orders",
      label: "Orders",
      icon: ShoppingBag,
      description: "Order Management"
    },
    {
      path: "/users",
      label: "Users",
      icon: Users,
      description: "User Management"
    },
    {
      path: "/payments",
      label: "Payments",
      icon: CreditCard,
      description: "Payment Transactions"
    },
    
  
  ];

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked, but keep it open on desktop
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
    // On desktop, sidebar stays open when navigating
  };

 const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } ${
        darkMode 
          ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900'
      } text-white w-64 shadow-2xl overflow-hidden`} style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-8 left-8 w-24 h-24 bg-cyan-400/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-32 right-6 w-16 h-16 bg-blue-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-4 w-28 h-28 bg-teal-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Header */}
        <div className="relative p-4 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 via-blue-500 to-teal-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Droplets className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                  <Waves className="h-1.5 w-1.5 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-base font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  Rainal Global
                </h2>
                <p className="text-slate-300 text-xs font-medium">Water Management</p>
              </div>
            </div>

            {/* Enhanced hide sidebar button */}
            <button
              onClick={() => setIsOpen(false)}
              className="group relative p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200 shadow-lg hover:shadow-xl"
              title="Hide sidebar"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              <div className="relative flex items-center justify-center">
                <ChevronLeft className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors duration-200" />
              </div>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 relative">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={`group relative block p-3 rounded-lg transition-all duration-300 transform ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-teal-500/20 backdrop-blur-sm border border-cyan-400/30 shadow-md scale-105"
                      : "hover:bg-slate-800/50 hover:backdrop-blur-sm hover:border hover:border-slate-700/50 hover:scale-102 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-sm"
                        : "bg-slate-700/50 group-hover:bg-slate-600/50"
                    }`}>
                      <Icon className={`h-4 w-4 transition-all duration-300 ${
                        isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold transition-colors duration-300 text-sm ${
                        isActive ? "text-white" : "text-slate-300 group-hover:text-white"
                      }`}>
                        {item.label}
                      </p>
                      <p className={`text-xs transition-colors duration-300 truncate ${
                        isActive ? "text-cyan-200" : "text-slate-500 group-hover:text-slate-400"
                      }`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Login/Logout Section */}
        <div className="relative p-3 border-t border-slate-700/50">
          {/* User Info */}
          <div className="mb-3 p-2.5 rounded-lg bg-slate-800/30 backdrop-blur-sm border border-slate-700/30">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white font-semibold text-xs">JD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold truncate">John Doe</p>
                <p className="text-slate-400 text-xs truncate">admin@rainalglobal.com</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
             onClick={handleLogout}
            className="group relative w-full p-2.5 rounded-lg transition-all duration-300 transform hover:bg-red-500/10 hover:backdrop-blur-sm hover:border hover:border-red-400/30 hover:scale-102 hover:shadow-sm"
          >
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg transition-all duration-300 bg-slate-700/50 group-hover:bg-red-500/20">
                <LogOut className="h-4 w-4 text-slate-400 group-hover:text-red-400 transition-all duration-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold transition-colors duration-300 text-xs text-slate-300 group-hover:text-red-400">
                  Logout
                </p>
                <p className="text-xs transition-colors duration-300 truncate text-slate-500 group-hover:text-red-300/70">
                  Sign out of account
                </p>
              </div>
            </div>
          </button>

          {/* Company Footer */}
          <div className="text-center mt-3">
            <p className="text-xs text-slate-500">
              © 2024 Rainal Global Limited
            </p>
            <p className="text-xs text-slate-600 mt-0.5">
              Water Management System v2.0
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// Sidebar Toggle Button Component (place this in your main layout)
export function SidebarToggle({ isOpen, setIsOpen }) {
  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className={`fixed top-4 z-50 p-2 rounded-lg bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-all duration-300 ${
        isOpen ? 'left-72' : 'left-4'
      }`}
    >
      <Menu className="h-5 w-5 text-gray-700" />
    </button>
  );
}