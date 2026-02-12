import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  MapPin,
  Phone,
  Mail,
  Package,
  Calendar,
  CreditCard,
  FileText,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ExternalLink,
  Printer,
  Download,
  Droplets,
  Save,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../utils/api";
import { Loader2 } from "lucide-react";

export default function ViewOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchOrderDetails();

    // Load theme from localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
    }
  }, [id]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
  };

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/orders/${id}`);
      setOrder(res.data);
      setSelectedStatus(res.data.status);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
      alert("Failed to load order details");
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (selectedStatus === order.status) {
      alert("Status is already set to this value");
      return;
    }

    setUpdating(true);
    try {
      await API.put(`/orders/${id}/status`, { status: selectedStatus });
      alert("Order status updated successfully!");
      fetchOrderDetails();
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    if (darkMode) {
      switch (status) {
        case "PENDING":
          return "bg-amber-900/50 text-amber-300 border border-amber-600/50";
        case "ACCEPTED":
          return "bg-cyan-900/50 text-cyan-300 border border-cyan-600/50";
        case "DISPATCHED":
          return "bg-purple-900/50 text-purple-300 border border-purple-600/50";
        case "DELIVERED":
          return "bg-emerald-900/50 text-emerald-300 border border-emerald-600/50";
        case "CANCELLED":
          return "bg-red-900/50 text-red-300 border border-red-600/50";
        default:
          return "bg-gray-800/50 text-gray-300 border border-gray-600/50";
      }
    } else {
      switch (status) {
        case "PENDING":
          return "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-200/50 shadow-sm";
        case "ACCEPTED":
          return "bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 border border-cyan-200/50 shadow-sm";
        case "DISPATCHED":
          return "bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 border border-purple-200/50 shadow-sm";
        case "DELIVERED":
          return "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-200/50 shadow-sm";
        case "CANCELLED":
          return "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200/50 shadow-sm";
        default:
          return "bg-gradient-to-r from-slate-50 to-gray-50 text-slate-700 border border-slate-200/50 shadow-sm";
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4" />;
      case "ACCEPTED":
        return <CheckCircle className="h-4 w-4" />;
      case "DISPATCHED":
        return <Truck className="h-4 w-4" />;
      case "DELIVERED":
        return <Package className="h-4 w-4" />;
      case "CANCELLED":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getTotalPrice = () => {
    if (!order) return 0;
    return order.items.reduce((total, item) => {
      const price = item.productId?.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const openMapsLink = (address) => {
    // If address has lat/lng, use them
    if (address?.lat && address?.lng) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${address.lat},${address.lng}`,
        "_blank"
      );
    } else {
      // Otherwise, search by address string
      const addressStr =
        typeof address === "string" ? address : address?.fullAddress || "";
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          addressStr
        )}`,
        "_blank"
      );
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen transition-colors duration-300 ${
          darkMode
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
            : "bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50"
        }`}
      >
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
        <div
          className={`transition-all duration-300 ${
            sidebarOpen ? "lg:ml-64" : "lg:ml-0"
          } pt-16`}
        >
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-xl">
                <Loader2 className="animate-spin h-8 w-8 text-white" />
              </div>
              <span
                className={`font-medium text-lg ${
                  darkMode ? "text-gray-300" : "text-slate-600"
                }`}
              >
                Loading order details...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50"
      }`}
    >
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

      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-0"
        } pt-16`}
      >
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => navigate("/orders")}
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg mb-6 transition-all duration-200 ${
                darkMode
                  ? "bg-gray-800/80 text-gray-300 border border-gray-700/50 hover:bg-gray-700"
                  : "bg-white/80 text-slate-700 border border-slate-200 hover:bg-white shadow-sm"
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium">Back to Orders</span>
            </button>

            {/* Header Section */}
            <div className="mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-blue-500/10 to-teal-400/10 rounded-2xl blur-3xl"></div>
              <div
                className={`relative backdrop-blur-sm rounded-xl p-4 sm:p-6 border shadow-lg ${
                  darkMode
                    ? "bg-gray-800/80 border-gray-700/20"
                    : "bg-white/80 border-white/20"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-md">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1
                        className={`text-2xl sm:text-3xl font-bold ${
                          darkMode ? "text-gray-100" : "text-slate-800"
                        }`}
                      >
                        Order #{order.orderId || order._id}
                      </h1>
                      <div className="flex items-center space-x-2 mt-2">
                        <span
                          className={`inline-flex items-center space-x-1 px-3 py-1 text-sm font-bold rounded-lg ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          <span>{order.status}</span>
                        </span>
                        <span
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-slate-500"
                          }`}
                        >
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handlePrint}
                      className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        darkMode
                          ? "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600"
                          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm"
                      }`}
                    >
                      <Printer className="h-4 w-4" />
                      <span className="hidden sm:inline">Print</span>
                    </button>
                    <button
                      className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        darkMode
                          ? "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600"
                          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm"
                      }`}
                    >
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Export</span>
                    </button>
                  </div>
                </div>

                {/* Status Update Section */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <label
                      className={`text-sm font-semibold ${
                        darkMode ? "text-gray-300" : "text-slate-700"
                      }`}
                    >
                      Change Order Status:
                    </label>
                    <div className="flex items-center space-x-3">
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className={`border rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 backdrop-blur-sm font-medium transition-all duration-200 ${
                          darkMode
                            ? "border-gray-600 bg-gray-700/90 text-gray-200 hover:bg-gray-600"
                            : "border-slate-300 bg-white/90 text-slate-700 hover:bg-white"
                        }`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="ACCEPTED">ACCEPTED</option>
                        <option value="DISPATCHED">DISPATCHED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                      <button
                        onClick={handleStatusUpdate}
                        disabled={updating || selectedStatus === order.status}
                        className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                          darkMode
                            ? "bg-gradient-to-r from-cyan-600 to-blue-700 text-white hover:from-cyan-700 hover:to-blue-800"
                            : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700"
                        }`}
                      >
                        {updating ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            <span>Save Status</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Order Details (2/3 width on large screens) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Order Summary */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-blue-500/5 rounded-xl blur-xl"></div>
                  <div
                    className={`relative backdrop-blur-sm rounded-xl shadow-lg border overflow-hidden ${
                      darkMode
                        ? "bg-gray-800/90 border-gray-700/20"
                        : "bg-white/90 border-white/20"
                    }`}
                  >
                    <div className="bg-gradient-to-r from-cyan-600 to-blue-700 px-4 sm:px-6 py-3">
                      <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                        <FileText className="h-5 w-5" />
                        <span>Order Summary</span>
                      </h2>
                    </div>
                    <div className="p-4 sm:p-6 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            className={`text-xs font-semibold uppercase tracking-wider ${
                              darkMode ? "text-gray-400" : "text-slate-500"
                            }`}
                          >
                            Order ID
                          </label>
                          <p
                            className={`mt-1 text-sm font-bold ${
                              darkMode ? "text-gray-200" : "text-slate-800"
                            }`}
                          >
                            #{order.orderId || order._id}
                          </p>
                        </div>
                        <div>
                          <label
                            className={`text-xs font-semibold uppercase tracking-wider ${
                              darkMode ? "text-gray-400" : "text-slate-500"
                            }`}
                          >
                            Order Date
                          </label>
                          <p
                            className={`mt-1 text-sm font-bold ${
                              darkMode ? "text-gray-200" : "text-slate-800"
                            }`}
                          >
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div>
                          <label
                            className={`text-xs font-semibold uppercase tracking-wider ${
                              darkMode ? "text-gray-400" : "text-slate-500"
                            }`}
                          >
                            Payment Method
                          </label>
                          <p
                            className={`mt-1 text-sm font-bold ${
                              darkMode ? "text-gray-200" : "text-slate-800"
                            }`}
                          >
                            {order.paymentMethod || "Cash on Delivery"}
                          </p>
                        </div>
                        <div>
                          <label
                            className={`text-xs font-semibold uppercase tracking-wider ${
                              darkMode ? "text-gray-400" : "text-slate-500"
                            }`}
                          >
                            Payment Status
                          </label>
                          <p
                            className={`mt-1 text-sm font-bold ${
                              darkMode ? "text-gray-200" : "text-slate-800"
                            }`}
                          >
                            {order.paymentStatus || "Pending"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <label
                          className={`text-xs font-semibold uppercase tracking-wider ${
                            darkMode ? "text-gray-400" : "text-slate-500"
                          }`}
                        >
                          Total Amount
                        </label>
                        <p
                          className={`mt-1 text-2xl font-bold ${
                            darkMode ? "text-emerald-300" : "text-emerald-600"
                          }`}
                        >
                          ₦{getTotalPrice().toLocaleString()}
                        </p>
                      </div>

                      {order.deliveryNotes && (
                        <div>
                          <label
                            className={`text-xs font-semibold uppercase tracking-wider ${
                              darkMode ? "text-gray-400" : "text-slate-500"
                            }`}
                          >
                            Delivery Notes
                          </label>
                          <p
                            className={`mt-1 text-sm ${
                              darkMode ? "text-gray-300" : "text-slate-700"
                            }`}
                          >
                            {order.deliveryNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-blue-500/5 rounded-xl blur-xl"></div>
                  <div
                    className={`relative backdrop-blur-sm rounded-xl shadow-lg border overflow-hidden ${
                      darkMode
                        ? "bg-gray-800/90 border-gray-700/20"
                        : "bg-white/90 border-white/20"
                    }`}
                  >
                    <div className="bg-gradient-to-r from-cyan-600 to-blue-700 px-4 sm:px-6 py-3">
                      <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                        <Droplets className="h-5 w-5" />
                        <span>Water Products ({order.items.length})</span>
                      </h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead
                          className={`${
                            darkMode ? "bg-gray-700/50" : "bg-slate-50/80"
                          }`}
                        >
                          <tr>
                            <th
                              className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider ${
                                darkMode ? "text-gray-300" : "text-slate-600"
                              }`}
                            >
                              Product
                            </th>
                            <th
                              className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider ${
                                darkMode ? "text-gray-300" : "text-slate-600"
                              }`}
                            >
                              Size
                            </th>
                            <th
                              className={`px-4 py-3 text-right text-xs font-bold uppercase tracking-wider ${
                                darkMode ? "text-gray-300" : "text-slate-600"
                              }`}
                            >
                              Price
                            </th>
                            <th
                              className={`px-4 py-3 text-center text-xs font-bold uppercase tracking-wider ${
                                darkMode ? "text-gray-300" : "text-slate-600"
                              }`}
                            >
                              Qty
                            </th>
                            <th
                              className={`px-4 py-3 text-right text-xs font-bold uppercase tracking-wider ${
                                darkMode ? "text-gray-300" : "text-slate-600"
                              }`}
                            >
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody
                          className={`divide-y ${
                            darkMode ? "divide-gray-600" : "divide-slate-100"
                          }`}
                        >
                          {order.items.map((item, index) => (
                            <tr
                              key={index}
                              className={`transition-colors duration-200 ${
                                darkMode
                                  ? "hover:bg-gray-700/30"
                                  : "hover:bg-cyan-50/30"
                              }`}
                            >
                              <td className="px-4 py-4">
                                <div className="flex items-center space-x-3">
                                  {item.productId?.img ? (
                                    <img
                                      src={item.productId.img}
                                      alt={item.productId.name}
                                      className="w-12 h-12 rounded-lg object-cover shadow-sm"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                                      <Droplets className="h-6 w-6 text-white" />
                                    </div>
                                  )}
                                  <div>
                                    <p
                                      className={`text-sm font-bold ${
                                        darkMode
                                          ? "text-gray-200"
                                          : "text-slate-800"
                                      }`}
                                    >
                                      {item.productId?.name || "Unknown Product"}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td
                                className={`px-4 py-4 text-sm ${
                                  darkMode ? "text-gray-300" : "text-slate-700"
                                }`}
                              >
                                {item.productId?.size || "N/A"}
                              </td>
                              <td
                                className={`px-4 py-4 text-sm text-right font-semibold ${
                                  darkMode ? "text-gray-200" : "text-slate-800"
                                }`}
                              >
                                ₦{(item.productId?.price || 0).toLocaleString()}
                              </td>
                              <td
                                className={`px-4 py-4 text-sm text-center font-bold ${
                                  darkMode ? "text-cyan-300" : "text-cyan-600"
                                }`}
                              >
                                ×{item.quantity}
                              </td>
                              <td
                                className={`px-4 py-4 text-sm text-right font-bold ${
                                  darkMode ? "text-emerald-300" : "text-emerald-600"
                                }`}
                              >
                                ₦
                                {(
                                  (item.productId?.price || 0) * item.quantity
                                ).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot
                          className={`${
                            darkMode ? "bg-gray-700/50" : "bg-slate-50/80"
                          }`}
                        >
                          <tr>
                            <td
                              colSpan="4"
                              className={`px-4 py-4 text-right text-sm font-bold uppercase ${
                                darkMode ? "text-gray-300" : "text-slate-700"
                              }`}
                            >
                              Grand Total:
                            </td>
                            <td
                              className={`px-4 py-4 text-right text-lg font-bold ${
                                darkMode ? "text-emerald-300" : "text-emerald-600"
                              }`}
                            >
                              ₦{getTotalPrice().toLocaleString()}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Status Timeline */}
                {order.statusHistory && order.statusHistory.length > 0 && (
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-blue-500/5 rounded-xl blur-xl"></div>
                    <div
                      className={`relative backdrop-blur-sm rounded-xl shadow-lg border overflow-hidden ${
                        darkMode
                          ? "bg-gray-800/90 border-gray-700/20"
                          : "bg-white/90 border-white/20"
                      }`}
                    >
                      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 px-4 sm:px-6 py-3">
                        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                          <Calendar className="h-5 w-5" />
                          <span>Status Timeline</span>
                        </h2>
                      </div>
                      <div className="p-4 sm:p-6">
                        <div className="space-y-4">
                          {order.statusHistory.map((history, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <div
                                className={`mt-1 p-2 rounded-full ${getStatusColor(
                                  history.status
                                )}`}
                              >
                                {getStatusIcon(history.status)}
                              </div>
                              <div className="flex-1">
                                <p
                                  className={`text-sm font-bold ${
                                    darkMode ? "text-gray-200" : "text-slate-800"
                                  }`}
                                >
                                  {history.status}
                                </p>
                                <p
                                  className={`text-xs ${
                                    darkMode ? "text-gray-400" : "text-slate-500"
                                  }`}
                                >
                                  {formatDate(history.at)}
                                  {history.by && ` by ${history.by}`}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Proof of Delivery */}
                {order.pod && order.pod.length > 0 && (
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-blue-500/5 rounded-xl blur-xl"></div>
                    <div
                      className={`relative backdrop-blur-sm rounded-xl shadow-lg border overflow-hidden ${
                        darkMode
                          ? "bg-gray-800/90 border-gray-700/20"
                          : "bg-white/90 border-white/20"
                      }`}
                    >
                      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 px-4 sm:px-6 py-3">
                        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                          <Package className="h-5 w-5" />
                          <span>Proof of Delivery</span>
                        </h2>
                      </div>
                      <div className="p-4 sm:p-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {order.pod.map((proof, index) => (
                            <div
                              key={index}
                              className="relative group cursor-pointer"
                              onClick={() => setSelectedImage(proof.url)}
                            >
                              <img
                                src={proof.url}
                                alt={`Proof ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-all duration-200"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center transition-opacity duration-200">
                                <ExternalLink className="h-6 w-6 text-white" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Customer & Delivery (1/3 width on large screens) */}
              <div className="space-y-6">
                {/* Customer Information */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-blue-500/5 rounded-xl blur-xl"></div>
                  <div
                    className={`relative backdrop-blur-sm rounded-xl shadow-lg border overflow-hidden ${
                      darkMode
                        ? "bg-gray-800/90 border-gray-700/20"
                        : "bg-white/90 border-white/20"
                    }`}
                  >
                    <div className="bg-gradient-to-r from-cyan-600 to-blue-700 px-4 sm:px-6 py-3">
                      <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                        <User className="h-5 w-5" />
                        <span>Customer</span>
                      </h2>
                    </div>
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        {order.userId?.avatar ? (
                          <img
                            src={order.userId.avatar}
                            alt={order.userId.name}
                            className="w-16 h-16 rounded-full object-cover shadow-md"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                            <User className="h-8 w-8 text-white" />
                          </div>
                        )}
                        <div>
                          <p
                            className={`text-lg font-bold ${
                              darkMode ? "text-gray-200" : "text-slate-800"
                            }`}
                          >
                            {order.userId?.name || "Unknown Customer"}
                          </p>
                          <button
                            onClick={() =>
                              navigate(`/users/${order.userId?._id}`)
                            }
                            className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
                          >
                            View profile →
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <Mail
                            className={`h-5 w-5 mt-0.5 ${
                              darkMode ? "text-gray-400" : "text-slate-400"
                            }`}
                          />
                          <div>
                            <p
                              className={`text-xs uppercase tracking-wider font-semibold ${
                                darkMode ? "text-gray-400" : "text-slate-500"
                              }`}
                            >
                              Email
                            </p>
                            <a
                              href={`mailto:${order.userId?.email}`}
                              className={`text-sm hover:text-cyan-600 ${
                                darkMode ? "text-gray-300" : "text-slate-700"
                              }`}
                            >
                              {order.userId?.email || "N/A"}
                            </a>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Phone
                            className={`h-5 w-5 mt-0.5 ${
                              darkMode ? "text-gray-400" : "text-slate-400"
                            }`}
                          />
                          <div>
                            <p
                              className={`text-xs uppercase tracking-wider font-semibold ${
                                darkMode ? "text-gray-400" : "text-slate-500"
                              }`}
                            >
                              Phone
                            </p>
                            <a
                              href={`tel:${order.userId?.phone}`}
                              className={`text-sm hover:text-cyan-600 ${
                                darkMode ? "text-gray-300" : "text-slate-700"
                              }`}
                            >
                              {order.userId?.phone || "N/A"}
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col space-y-2">
                          <a
                            href={`tel:${order.userId?.phone}`}
                            className={`inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                              darkMode
                                ? "bg-cyan-900/50 text-cyan-300 border border-cyan-600/50 hover:bg-cyan-800/50"
                                : "bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 border border-cyan-200/50 hover:from-cyan-100 hover:to-blue-100"
                            }`}
                          >
                            <Phone className="h-4 w-4" />
                            <span>Call Customer</span>
                          </a>
                          <a
                            href={`mailto:${order.userId?.email}`}
                            className={`inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                              darkMode
                                ? "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600"
                                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            <Mail className="h-4 w-4" />
                            <span>Send Email</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-blue-500/5 rounded-xl blur-xl"></div>
                  <div
                    className={`relative backdrop-blur-sm rounded-xl shadow-lg border overflow-hidden ${
                      darkMode
                        ? "bg-gray-800/90 border-gray-700/20"
                        : "bg-white/90 border-white/20"
                    }`}
                  >
                    <div className="bg-gradient-to-r from-cyan-600 to-blue-700 px-4 sm:px-6 py-3">
                      <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                        <MapPin className="h-5 w-5" />
                        <span>Delivery Address</span>
                      </h2>
                    </div>
                    <div className="p-4 sm:p-6">
                      {order.address?.label && (
                        <div className="mb-3">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                              darkMode
                                ? "bg-cyan-900/50 text-cyan-300"
                                : "bg-cyan-50 text-cyan-700"
                            }`}
                          >
                            {order.address.label}
                          </span>
                        </div>
                      )}
                      <p
                        className={`text-sm leading-relaxed ${
                          darkMode ? "text-gray-300" : "text-slate-700"
                        }`}
                      >
                        {typeof order.address === "string"
                          ? order.address
                          : order.address?.fullAddress || "No address provided"}
                      </p>

                      <button
                        onClick={() => openMapsLink(order.address)}
                        className={`mt-4 w-full inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          darkMode
                            ? "bg-emerald-900/50 text-emerald-300 border border-emerald-600/50 hover:bg-emerald-800/50"
                            : "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-200/50 hover:from-emerald-100 hover:to-teal-100"
                        }`}
                      >
                        <MapPin className="h-4 w-4" />
                        <span>Open in Maps</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-blue-500/5 rounded-xl blur-xl"></div>
                  <div
                    className={`relative backdrop-blur-sm rounded-xl shadow-lg border overflow-hidden ${
                      darkMode
                        ? "bg-gray-800/90 border-gray-700/20"
                        : "bg-white/90 border-white/20"
                    }`}
                  >
                    <div className="bg-gradient-to-r from-cyan-600 to-blue-700 px-4 sm:px-6 py-3">
                      <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                        <CreditCard className="h-5 w-5" />
                        <span>Payment</span>
                      </h2>
                    </div>
                    <div className="p-4 sm:p-6 space-y-3">
                      <div>
                        <p
                          className={`text-xs uppercase tracking-wider font-semibold ${
                            darkMode ? "text-gray-400" : "text-slate-500"
                          }`}
                        >
                          Payment Method
                        </p>
                        <p
                          className={`text-sm font-bold mt-1 ${
                            darkMode ? "text-gray-200" : "text-slate-800"
                          }`}
                        >
                          {order.paymentMethod || "Cash on Delivery"}
                        </p>
                      </div>
                      <div>
                        <p
                          className={`text-xs uppercase tracking-wider font-semibold ${
                            darkMode ? "text-gray-400" : "text-slate-500"
                          }`}
                        >
                          Payment Status
                        </p>
                        <span
                          className={`inline-flex px-3 py-1 mt-1 rounded-lg text-xs font-bold ${
                            order.paymentStatus === "Paid"
                              ? darkMode
                                ? "bg-emerald-900/50 text-emerald-300"
                                : "bg-emerald-50 text-emerald-700"
                              : darkMode
                              ? "bg-amber-900/50 text-amber-300"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {order.paymentStatus || "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <XCircle className="h-8 w-8" />
            </button>
            <img
              src={selectedImage}
              alt="Proof of Delivery"
              className="max-w-full max-h-[80vh] rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}