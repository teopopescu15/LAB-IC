"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status (simplified version)
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const data = await response.json();
        setIsLoggedIn(!!data.user);
      } catch (error) {
        console.error("Failed to check login status", error);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <header className="bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <Link href="/" className="text-2xl font-bold text-blue-500">
            PetPals
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/pets" className="hover:text-gray-600">
              Find Pets
            </Link>
            {isLoggedIn ? (
              <button
                onClick={() => {
                  // Add logout logic here
                  setIsLoggedIn(false);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
