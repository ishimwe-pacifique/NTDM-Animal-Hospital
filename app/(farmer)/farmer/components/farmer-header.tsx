"use client";
import { logoutUser } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import { Bell, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// Import your user fetching logic
import { getCurrentUser } from "@/lib/auth";

export default function FarmerHeader() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [user, setUser] = useState<{ name?: string; image?: string } | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch current user info on mount
    async function fetchUser() {
      const userData = await getCurrentUser();
      setUser(userData);
    }
    fetchUser();
  }, []);

  // Close profile dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    }
    if (profileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileDropdownOpen]);

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <header className="backdrop-blur-md bg-green-800/70 shadow-lg text-white sticky top-0 z-20">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="bg-white rounded-full p-1 hidden sm:block">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center overflow-hidden">
              <Image
                src="/farmer-logo.png"
                alt="Farmer Logo"
                width={36}
                height={36}
                className="object-cover"
                priority
              />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight">Farmer Dashboard</h1>
            <span className="text-xs text-green-100 font-medium hidden sm:block">
              Welcome{user?.name ? `, ${user.name}!` : ", Farmer!"}
            </span>
          </div>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Notification bell */}
          <button
            className="relative p-2 rounded-full bg-white/80 hover:bg-green-100/80 transition shadow focus:outline-none"
            aria-label="Notifications"
          >
            <Bell className="h-6 w-6 text-green-800" />
            <span className="absolute top-1 right-1 bg-yellow-400 text-xs text-white rounded-full px-1.5 py-0.5 font-bold">
              3
            </span>
          </button>
          {/* Profile dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              className="flex items-center space-x-2 focus:outline-none"
              onClick={() => setProfileDropdownOpen((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={profileDropdownOpen}
            >
              <Image
                src={user?.image || "/avatars/01.png"}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full border-2 border-green-200"
              />
              <span className="hidden lg:block font-medium">
                {user?.name || "Farmer"}
              </span>
            </button>
            {/* Dropdown menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-green-800 rounded shadow-lg py-2 z-30">
                <a href="/farmer/profile" className="block px-4 py-2 hover:bg-green-50">Profile</a>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-green-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white focus:outline-none p-2 rounded-full bg-green-900/80"
          onClick={toggleMobileMenu}
          aria-label="Open menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-green-900/95 p-4 shadow-inner space-y-2">
          <div className="flex items-center space-x-3 mb-4">
            <Image
              src={user?.image || "/avatars/01.png"}
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full border-2 border-green-200"
            />
            <span className="font-medium text-white">{user?.name || "Farmer"}</span>
          </div>
          <a
            href="/farmer/profile"
            className="block px-4 py-2 bg-white text-green-700 font-medium rounded-md hover:bg-gray-100 transition"
          >
            Profile
          </a>
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