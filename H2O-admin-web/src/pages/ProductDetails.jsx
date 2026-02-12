import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, Droplets, Package2, DollarSign, Waves, Beaker, Clock, Tag } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../utils/api";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchProduct();
    
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

  const fetchProduct = async () => {
    const res = await API.get(`/products/${id}`);
    setProduct(res.data);
  };

  if (!product) return (
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
          <div className="flex items-center justify-center h-80">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-xl">
                <Loader2 className="animate-spin h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <p className={`font-medium text-base sm:text-lg ${
                darkMode ? 'text-gray-300' : 'text-slate-600'
              }`}>Loading water product details...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
          <div className="max-w-6xl mx-auto">
            
            {/* Header with Back Button */}
            <div className="mb-6">
              <Link
                to="/products"
                className={`inline-flex items-center space-x-2 transition-colors duration-200 group mb-4 ${
                  darkMode 
                    ? 'text-gray-400 hover:text-cyan-400' 
                    : 'text-slate-600 hover:text-cyan-600'
                }`}
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-medium text-sm sm:text-base">Back to Products</span>
              </Link>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-blue-500/10 to-teal-400/10 rounded-2xl blur-3xl"></div>
                <div className={`relative backdrop-blur-sm rounded-xl p-4 sm:p-6 border shadow-lg ${
                  darkMode 
                    ? 'bg-gray-800/80 border-gray-700/20' 
                    : 'bg-white/80 border-white/20'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-md">
                      <Beaker className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
                        Product Details
                      </h1>
                      <p className={`text-sm sm:text-base ${
                        darkMode ? 'text-gray-400' : 'text-slate-600'
                      }`}>Water product information and specifications</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Product Details Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-blue-500/5 to-teal-400/5 rounded-2xl blur-3xl"></div>
              <div className={`relative backdrop-blur-sm rounded-2xl shadow-2xl border overflow-hidden ${
                darkMode 
                  ? 'bg-gray-800/90 border-gray-700/20' 
                  : 'bg-white/90 border-white/20'
              }`}>
                <div className="flex flex-col lg:flex-row">
                  
                  {/* Image Section */}
                  <div className={`lg:w-1/2 p-6 sm:p-8 relative ${
                    darkMode 
                      ? 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800' 
                      : 'bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50'
                  }`}>
                    <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-md">
                      <Waves className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-500" />
                    </div>
                    <div className="aspect-square bg-white rounded-xl shadow-lg border-2 border-white/50 overflow-hidden group">
                      <img
                        src={product.img}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    
                    {/* Water Quality Badge */}
                    <div className="mt-4 sm:mt-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-4 sm:p-6 text-white shadow-lg">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <Droplets className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm sm:text-base">Premium Quality</h3>
                          <p className="text-emerald-100 text-xs sm:text-sm">Rainal Global Limited certified</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="lg:w-1/2 p-6 sm:p-8 lg:p-12">
                    <div className="space-y-6 sm:space-y-8">
                      
                      {/* Product Name */}
                      <div>
                        <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                          <div className="w-1 sm:w-2 h-6 sm:h-8 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full"></div>
                          <h2 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${
                            darkMode ? 'text-white' : 'text-slate-800'
                          }`}>{product.name}</h2>
                        </div>
                        <div className="h-1 w-16 sm:w-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
                      </div>
                      
                      {/* Product Info Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        
                        {/* Size Card */}
                        <div className={`rounded-xl p-4 sm:p-6 border shadow-md ${
                          darkMode 
                            ? 'bg-cyan-900/30 border-cyan-600/50' 
                            : 'bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200/50'
                        }`}>
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="p-2 sm:p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-md">
                              <Package2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                            </div>
                            <div>
                              <p className={`text-xs font-bold uppercase tracking-wider ${
                                darkMode ? 'text-gray-400' : 'text-slate-600'
                              }`}>Volume/Size</p>
                              <p className={`text-lg sm:text-xl font-bold ${
                                darkMode ? 'text-white' : 'text-slate-800'
                              }`}>{product.size}</p>
                            </div>
                          </div>
                        </div>

                        {/* Price Card */}
                        <div className={`rounded-xl p-4 sm:p-6 border shadow-md ${
                          darkMode 
                            ? 'bg-emerald-900/30 border-emerald-600/50' 
                            : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200/50'
                        }`}>
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-md">
                              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                            </div>
                            <div>
                              <p className={`text-xs font-bold uppercase tracking-wider ${
                                darkMode ? 'text-gray-400' : 'text-slate-600'
                              }`}>Price</p>
                              <p className={`text-lg sm:text-xl font-bold ${
                                darkMode ? 'text-white' : 'text-slate-800'
                              }`}>₦{Number(product.price).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Product Features */}
                      <div className={`rounded-xl p-6 border shadow-md ${
                        darkMode 
                          ? 'bg-gray-700/30 border-gray-600/50' 
                          : 'bg-gradient-to-br from-slate-50 to-cyan-50 border-slate-200/50'
                      }`}>
                        <h3 className={`text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center ${
                          darkMode ? 'text-white' : 'text-slate-800'
                        }`}>
                          <Tag className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-cyan-500" />
                          Product Features
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          {[
                            'Pure & Clean Water',
                            'Quality Tested', 
                            'Safe Packaging',
                            'Fast Delivery'
                          ].map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2 sm:space-x-3">
                              <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                              <span className={`font-medium text-sm sm:text-base ${
                                darkMode ? 'text-gray-200' : 'text-slate-700'
                              }`}>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Company Branding */}
                      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className="p-2 sm:p-3 bg-white/20 rounded-lg">
                            <Waves className="h-6 w-6 sm:h-7 sm:w-7" />
                          </div>
                          <div>
                            <h3 className="text-lg sm:text-xl font-bold">Rainal Global Limited</h3>
                            <p className="text-cyan-100 text-sm sm:text-base">Premium water solutions provider</p>
                          </div>
                        </div>
                        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-cyan-400/30">
                          <div className="flex items-center space-x-2 text-cyan-100">
                            <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="font-medium text-sm sm:text-base">Available for immediate delivery</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                        <Link
                          to="/products"
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-bold rounded-lg transition-all duration-200 text-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base"
                        >
                          Back to Products
                        </Link>
                        <Link
                          to="/orders"
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-lg transition-all duration-200 text-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base"
                        >
                          View Orders
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
