import { useState } from "react";
import { Settings as SettingsIcon, Save, RefreshCw, Shield, Bell, Database } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
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
                    <SettingsIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
                      System Settings
                    </h1>
                    <p className={`text-sm sm:text-base ${
                      darkMode ? 'text-gray-400' : 'text-slate-600'
                    }`}>Configure system preferences and application settings</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Coming Soon Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-blue-500/5 to-teal-400/5 rounded-2xl blur-2xl"></div>
              <div className={`relative backdrop-blur-sm rounded-xl shadow-xl border ${
                darkMode 
                  ? 'bg-gray-800/90 border-gray-700/20' 
                  : 'bg-white/90 border-white/20'
              }`}>
                <div className={`text-center py-20 ${
                  darkMode 
                    ? 'bg-gradient-to-br from-gray-800 to-gray-700' 
                    : 'bg-gradient-to-br from-slate-50 to-cyan-50'
                }`}>
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mb-6 shadow-xl">
                    <SettingsIcon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 ${
                    darkMode ? 'text-gray-200' : 'text-slate-700'
                  }`}>System Settings Coming Soon</h3>
                  <p className={`text-base max-w-md mx-auto mb-8 ${
                    darkMode ? 'text-gray-400' : 'text-slate-500'
                  }`}>
                    System configuration options will be available here to manage application preferences, 
                    security settings, and system configurations.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    <div className={`flex items-center space-x-2 px-4 py-3 rounded-lg ${
                      darkMode ? 'bg-gray-700 text-gray-300' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Shield className="h-4 w-4" />
                      <span className="text-sm font-medium">Security Settings</span>
                    </div>
                    <div className={`flex items-center space-x-2 px-4 py-3 rounded-lg ${
                      darkMode ? 'bg-gray-700 text-gray-300' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Bell className="h-4 w-4" />
                      <span className="text-sm font-medium">Notifications</span>
                    </div>
                    <div className={`flex items-center space-x-2 px-4 py-3 rounded-lg ${
                      darkMode ? 'bg-gray-700 text-gray-300' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Database className="h-4 w-4" />
                      <span className="text-sm font-medium">Database Config</span>
                    </div>
                    <div className={`flex items-center space-x-2 px-4 py-3 rounded-lg ${
                      darkMode ? 'bg-gray-700 text-gray-300' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Save className="h-4 w-4" />
                      <span className="text-sm font-medium">Backup Settings</span>
                    </div>
                    <div className={`flex items-center space-x-2 px-4 py-3 rounded-lg ${
                      darkMode ? 'bg-gray-700 text-gray-300' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <RefreshCw className="h-4 w-4" />
                      <span className="text-sm font-medium">System Updates</span>
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