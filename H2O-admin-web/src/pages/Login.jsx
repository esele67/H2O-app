import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Droplets, Waves, Eye, EyeOff, Shield } from "lucide-react";
import API from "../utils/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await API.post("/auth/admin/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      alert("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        {/* Image Container */}
        <div className="absolute inset-0">
          <img
            src="/s.png"
            alt="H2O Water Management"
            className="w-full h-full object-cover opacity-90"
          />
          {/* Gradient Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/40"></div>
        </div>

        {/* Branding Content Overlay */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Top Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500/20 backdrop-blur-sm p-3 rounded-2xl border border-blue-400/30">
              <Droplets className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Rainal Global</h1>
              <p className="text-blue-200 text-sm">Water Management Excellence</p>
            </div>
          </div>

          {/* Bottom Tagline */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-white leading-tight">
                Intelligent Water<br />Management Solutions
              </h2>
              <p className="text-blue-100 text-lg max-w-md">
                Advanced monitoring and control systems for sustainable water resource management
              </p>
            </div>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <span className="text-white text-sm font-medium">Real-time Monitoring</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <span className="text-white text-sm font-medium">Smart Analytics</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <span className="text-white text-sm font-medium">IoT Integration</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo (visible only on small screens) */}
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
            <div className="bg-blue-500 p-3 rounded-2xl">
              <Droplets className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Rainal Global</h1>
              <p className="text-slate-600 text-sm">Water Management System</p>
            </div>
          </div>

          {/* Login Form Container */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
                <Waves className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Admin Login</h2>
              <p className="text-slate-600">Access your admin dashboard</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="admin@rainalglobal.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Login</span>
                    <Shield className="w-5 h-5" />
                  </div>
                )}
              </button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-slate-500">
              <Shield className="w-4 h-4" />
              <span>Secure admin access</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center space-y-1">
            <p className="text-slate-600 text-sm">© 2024 Rainal Global Limited</p>
            <p className="text-slate-500 text-xs">Water Management System v2.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}