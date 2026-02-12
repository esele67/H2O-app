import { useEffect, useState } from "react";
import { Plus, Package, Upload, Image as ImageIcon, Trash, Droplets, Waves, Beaker } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../utils/api";
import { Link } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchProducts();
    
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

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  // Upload image to Cloudinary
  const uploadImage = async () => {
    if (!image) return null;
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", import.meta.env.VITE_PUBLIC_UPLOAD_PRESET);
    data.append("cloud_name", import.meta.env.VITE_PUBLIC_CLOUD_NAME);

    setUploading(true);
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_PUBLIC_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      const file = await res.json();
      setUploading(false);
      return file.secure_url;
    } catch (err) {
      console.error("Upload failed", err);
      setUploading(false);
      return null;
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  // Add product
  const addProduct = async (e) => {
    e.preventDefault();
    const imageUrl = await uploadImage();
    if (!imageUrl) return alert("Image upload failed");

    try {
      await API.post("/products", { name, price, size, img: imageUrl });
      setName("");
      setPrice("");
      setSize("");
      setImage(null);
      setImagePreview(null);
      fetchProducts();
    } catch (err) {
      console.error("Failed to add product", err);
      alert("Failed to add product");
    }
  };

  // Delete product
  const deleteProduct = async (productId) => {
    const ok = window.confirm("Are you sure you want to delete this water product?");
    if (!ok) return;

    try {
      setDeletingId(productId);
      await API.delete(`/products/${productId}`);
      // remove from state (optimistic)
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      setDeletingId(null);
    } catch (err) {
      console.error("Failed to delete product", err);
      setDeletingId(null);
      alert("Failed to delete product");
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
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-md">
                    <Beaker className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
                      Water Products
                    </h1>
                    <p className={`text-sm sm:text-base ${
                      darkMode ? 'text-gray-400' : 'text-slate-600'
                    }`}>Manage your water product inventory</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Product Form */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 to-teal-500/5 rounded-2xl blur-2xl"></div>
              <div className={`relative backdrop-blur-sm rounded-xl shadow-xl border overflow-hidden ${
                darkMode 
                  ? 'bg-gray-800/90 border-gray-700/20' 
                  : 'bg-white/90 border-white/20'
              }`}>
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-4 sm:px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Plus className="h-5 w-5 text-white" />
                    <h2 className="text-lg sm:text-xl font-bold text-white">Add New Water Product</h2>
                  </div>
                  <p className="text-emerald-100 mt-1 text-sm">Add a new water product to your inventory</p>
                </div>

                <form onSubmit={addProduct} className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <label className={`block text-sm font-bold mb-2 ${
                          darkMode ? 'text-gray-200' : 'text-slate-700'
                        }`}>
                          Product Name *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Premium Drinking Water"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 backdrop-blur-sm transition-all duration-200 font-medium text-sm ${
                            darkMode 
                              ? 'border-gray-600 bg-gray-700/80 text-white placeholder-gray-400' 
                              : 'border-slate-200 bg-white/80 text-slate-700 placeholder-slate-400'
                          }`}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-bold mb-2 ${
                          darkMode ? 'text-gray-200' : 'text-slate-700'
                        }`}>
                          Price (₦) *
                        </label>
                        <div className="relative">
                          <span className={`absolute left-4 top-1/2 transform -translate-y-1/2 font-bold ${
                            darkMode ? 'text-gray-400' : 'text-slate-500'
                          }`}>₦</span>
                          <input
                            type="number"
                            placeholder="0.00"
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 backdrop-blur-sm transition-all duration-200 font-medium text-sm ${
                              darkMode 
                                ? 'border-gray-600 bg-gray-700/80 text-white placeholder-gray-400' 
                                : 'border-slate-200 bg-white/80 text-slate-700 placeholder-slate-400'
                            }`}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`block text-sm font-bold mb-2 ${
                          darkMode ? 'text-gray-200' : 'text-slate-700'
                        }`}>
                          Size/Volume *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., 20L, 500ml, 1.5L"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 backdrop-blur-sm transition-all duration-200 font-medium text-sm ${
                            darkMode 
                              ? 'border-gray-600 bg-gray-700/80 text-white placeholder-gray-400' 
                              : 'border-slate-200 bg-white/80 text-slate-700 placeholder-slate-400'
                          }`}
                          value={size}
                          onChange={(e) => setSize(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <label className={`block text-sm font-bold mb-2 ${
                          darkMode ? 'text-gray-200' : 'text-slate-700'
                        }`}>
                          Product Image *
                        </label>
                        <div className="space-y-3 sm:space-y-4">
                          <input
                            type="file"
                            accept="image/*"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 backdrop-blur-sm text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-cyan-500 file:to-blue-600 file:text-white file:shadow-sm transition-all duration-200 ${
                              darkMode 
                                ? 'border-gray-600 bg-gray-700/80 text-gray-300' 
                                : 'border-slate-200 bg-white/80 text-slate-700'
                            }`}
                            onChange={handleImageChange}
                            required
                          />
                          {imagePreview && (
                            <div className="relative">
                              <div className={`w-full h-40 sm:h-48 rounded-lg overflow-hidden border-2 shadow-md ${
                                darkMode 
                                  ? 'border-gray-600 bg-gradient-to-br from-gray-800 to-gray-700' 
                                  : 'border-slate-200 bg-gradient-to-br from-slate-50 to-cyan-50'
                              }`}>
                                <img
                                  src={imagePreview}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className={`absolute top-2 right-2 backdrop-blur-sm rounded-lg p-2 shadow-md ${
                                darkMode ? 'bg-gray-800/90' : 'bg-white/90'
                              }`}>
                                <ImageIcon className={`h-4 w-4 ${
                                  darkMode ? 'text-gray-300' : 'text-slate-600'
                                }`} />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`mt-6 sm:mt-8 pt-4 sm:pt-6 border-t ${
                    darkMode ? 'border-gray-600' : 'border-slate-200'
                  }`}>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm"
                      disabled={uploading}
                    >
                      {uploading ? (
                        <>
                          <Upload className="h-4 w-4 animate-spin" />
                          <span>Uploading Image...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          <span>Add Water Product</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Products Inventory */}
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
                      <Package className="h-5 w-5 text-white" />
                      <h2 className="text-lg sm:text-xl font-bold text-white">Water Product Inventory</h2>
                    </div>
                    <div className="text-cyan-100 text-xs sm:text-sm font-medium">
                      {products.length} {products.length === 1 ? "product" : "products"} in stock
                    </div>
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
                          Product
                        </th>
                        <th className={`px-4 sm:px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-b ${
                          darkMode 
                            ? 'text-gray-300 border-gray-600' 
                            : 'text-slate-600 border-slate-200'
                        }`}>
                          Size/Volume
                        </th>
                        <th className={`px-4 sm:px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-b ${
                          darkMode 
                            ? 'text-gray-300 border-gray-600' 
                            : 'text-slate-600 border-slate-200'
                        }`}>
                          Price
                        </th>
                        <th className={`px-4 sm:px-6 py-3 text-right text-xs font-bold uppercase tracking-wider border-b ${
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
                      {products.map((p) => (
                        <tr key={p._id} className={`transition-all duration-200 ${
                          darkMode 
                            ? 'hover:bg-gray-700/30' 
                            : 'hover:bg-cyan-50/30'
                        }`}>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <Link to={`/products/${p._id}`} className="flex items-center space-x-3 hover:transform hover:scale-105 transition-all duration-200">
                              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden shadow-md border ${
                                darkMode 
                                  ? 'bg-gradient-to-br from-gray-700 to-gray-600 border-gray-600' 
                                  : 'bg-gradient-to-br from-slate-100 to-cyan-50 border-slate-200'
                              }`}>
                                <img
                                  src={p.img}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.parentNode.innerHTML =
                                      '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-100 to-blue-100"><svg class="w-6 h-6 text-cyan-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></div>';
                                  }}
                                />
                              </div>
                              <div>
                                <div className={`text-sm sm:text-base font-bold ${
                                  darkMode ? 'text-white' : 'text-slate-800'
                                }`}>{p.name}</div>
                                <div className={`text-xs sm:text-sm flex items-center mt-1 ${
                                  darkMode ? 'text-gray-400' : 'text-slate-500'
                                }`}>
                                  <Droplets className="h-3 w-3 mr-1 text-cyan-500" />
                                  Water Product
                                </div>
                              </div>
                            </Link>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-3 py-1 text-xs sm:text-sm font-bold rounded-lg border shadow-sm ${
                              darkMode 
                                ? 'bg-cyan-900/50 text-cyan-300 border-cyan-600' 
                                : 'bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 border-cyan-200'
                            }`}>
                              {p.size}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm sm:text-lg font-bold px-3 py-1 sm:py-2 rounded-lg border ${
                              darkMode 
                                ? 'text-emerald-300 bg-emerald-900/50 border-emerald-600' 
                                : 'text-slate-800 bg-emerald-50 border-emerald-200'
                            }`}>
                              ₦{Number(p.price).toLocaleString()}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right">
                            <div className="inline-flex items-center space-x-2">
                              <Link
                                to={`/products/${p._id}`}
                                className={`px-3 py-2 text-xs sm:text-sm font-semibold border rounded-lg transition-all duration-200 shadow-sm hover:shadow-md backdrop-blur-sm ${
                                  darkMode 
                                    ? 'border-gray-600 text-gray-300 bg-gray-700/80 hover:bg-gray-600 hover:border-gray-500' 
                                    : 'border-slate-200 text-slate-700 bg-white/80 hover:bg-slate-50 hover:border-slate-300'
                                }`}
                              >
                                View Details
                              </Link>
                              <button
                                onClick={() => deleteProduct(p._id)}
                                disabled={deletingId === p._id}
                                className="px-3 py-2 text-xs sm:text-sm font-semibold border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed bg-white/80 backdrop-blur-sm"
                                aria-label={`Delete ${p.name}`}
                              >
                                <Trash className="h-3 w-3" />
                                <span>{deletingId === p._id ? "Deleting..." : "Delete"}</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {products.length === 0 && (
                  <div className={`text-center py-16 sm:py-20 ${
                    darkMode 
                      ? 'bg-gradient-to-br from-gray-800 to-gray-700' 
                      : 'bg-gradient-to-br from-slate-50 to-cyan-50'
                  }`}>
                    <div className="text-slate-400 mb-6">
                      <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mb-6 shadow-xl">
                        <Package className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
                      </div>
                    </div>
                    <h3 className={`text-lg sm:text-2xl font-bold mb-4 ${
                      darkMode ? 'text-gray-200' : 'text-slate-700'
                    }`}>No water products yet</h3>
                    <p className={`text-sm sm:text-base max-w-md mx-auto ${
                      darkMode ? 'text-gray-400' : 'text-slate-500'
                    }`}>
                      Add your first water product to start building your inventory for Rainal Global Limited
                    </p>
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
