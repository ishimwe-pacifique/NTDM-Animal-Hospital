"use client";
import { logoutUser } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { useState } from "react";

export default function FarmerHeader() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-green-600 to-green-700 shadow-md text-white sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white rounded-full p-1 hidden sm:block">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-700 font-bold text-sm">F</span>
            </div>
          </div>
          <h1 className="text-xl font-bold">Farmer Dashboard</h1>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMobileMenu}
        >
          <Bell className="h-6 w-6" />
        </button>
        
        {/* Desktop menu */}
        <div className="hidden md:block">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white text-green-700 font-medium rounded-md hover:bg-gray-100 transition shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>
      
      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-green-800 p-4 shadow-inner">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-white text-green-700 font-medium rounded-md hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
} 