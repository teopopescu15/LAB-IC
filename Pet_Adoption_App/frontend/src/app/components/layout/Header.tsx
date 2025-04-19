"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check login status only once on mount
    async function checkLoginStatus() {
      try {
        const response = await fetch("/api/auth/session", {
          // Add cache headers
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        const data = await response.json();
        setIsLoggedIn(!!data.user);
      } catch (error) {
        console.error("Failed to check login status", error);
      } finally {
        setIsLoading(false);
      }
    }

    checkLoginStatus();
  }, []); // Empty dependency array means this runs once on mount

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative w-8 h-8">
                <Image
                  src="/images/petpals-icon.png"
                  alt="PetPals Logo"
                  width={32}
                  height={32}
                />
              </div>
              <span className="text-xl font-bold text-blue-600">PetPals</span>
            </Link>
          </div>

          {/* Right side - Auth Buttons */}
          <div className="flex items-center space-x-4">
            <>
              <Link
                href="/auth/login"
                className="bg-blue-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full transition-colors duration-200"
              >
                Conectare
              </Link>
              <Link
                href="/auth/signup"
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors duration-200 border border-gray-200"
              >
                Înregistrare
              </Link>
            </>
          </div>
        </div>
      </nav>
    </header>
  );
}
