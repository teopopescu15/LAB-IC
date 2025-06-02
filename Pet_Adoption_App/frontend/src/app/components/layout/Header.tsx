"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Determinăm dacă suntem pe pagina pets
  const isPetsPage = pathname === "/pets";
  // Determinăm dacă suntem pe homepage
  const isHomePage = pathname === "/";

  useEffect(() => {
    checkLoginStatus();
  }, []);

  async function checkLoginStatus() {
    try {
      const response = await fetch("/api/auth/session", {
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      const data = await response.json();

      if (data.user) {
        setIsLoggedIn(true);
        setUser(data.user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to check login status", error);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (response.ok) {
        setIsLoggedIn(false);
        setUser(null);
        // Redirect to home page after logout
        router.push("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  // Funcție pentru a renderiza butoanele în funcție de pagină și starea de autentificare
  const renderAuthButtons = () => {
    if (isLoading) {
      return (
        <div className="animate-pulse">
          <div className="h-8 lg:h-12 w-20 lg:w-24 bg-gray-200 rounded-full"></div>
        </div>
      );
    }

    // Pe pagina pets - arată doar dacă utilizatorul este autentificat
    if (isPetsPage && isLoggedIn) {
      return (
        <div className="flex items-center space-x-3 lg:space-x-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm lg:text-base font-medium text-gray-800">
              Bună, {user?.name}!
            </span>
            <span className="text-xs lg:text-sm text-gray-500">
              {user?.email}
            </span>
          </div>
          <Link
            href="/profile"
            className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-full transition-all duration-200 font-semibold text-xs sm:text-sm lg:text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Contul meu
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-full transition-all duration-200 font-semibold text-xs sm:text-sm lg:text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Deconectare
          </button>
        </div>
      );
    }

    // Pe homepage - arată doar butoanele de conectare/înregistrare
    if (isHomePage) {
      return (
        <>
          <Link
            href="/auth/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-5 lg:px-7 py-2 sm:py-3 lg:py-4 rounded-full transition-all duration-200 font-semibold text-xs sm:text-sm lg:text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Conectare
          </Link>
          <Link
            href="/auth/signup"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 sm:px-5 lg:px-7 py-2 sm:py-3 lg:py-4 rounded-full transition-all duration-200 border border-gray-300 hover:border-gray-400 font-semibold text-xs sm:text-sm lg:text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Înregistrare
          </Link>
        </>
      );
    }

    // Pe alte pagini - arată în funcție de starea de autentificare
    if (isLoggedIn) {
      return (
        <div className="flex items-center space-x-3 lg:space-x-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm lg:text-base font-medium text-gray-800">
              Bună, {user?.name}!
            </span>
            <span className="text-xs lg:text-sm text-gray-500">
              {user?.email}
            </span>
          </div>
          <Link
            href="/pets"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-full transition-all duration-200 font-semibold text-xs sm:text-sm lg:text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Animăluțe
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-full transition-all duration-200 font-semibold text-xs sm:text-sm lg:text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Deconectare
          </button>
        </div>
      );
    }

    // Nu este autentificat pe alte pagini
    return (
      <>
        <Link
          href="/auth/login"
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-5 lg:px-7 py-2 sm:py-3 lg:py-4 rounded-full transition-all duration-200 font-semibold text-xs sm:text-sm lg:text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Conectare
        </Link>
        <Link
          href="/auth/signup"
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 sm:px-5 lg:px-7 py-2 sm:py-3 lg:py-4 rounded-full transition-all duration-200 border border-gray-300 hover:border-gray-400 font-semibold text-xs sm:text-sm lg:text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Înregistrare
        </Link>
      </>
    );
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="w-full px-1 sm:px-2">
        <div className="flex justify-between items-center h-16 lg:h-20 max-w-7xl mx-auto">
          {/* Left corner - Logo positioned at the very left edge */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14">
                <Image
                  src="/images/petpals-icon.png"
                  alt="PetPals Logo"
                  width={56}
                  height={56}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 tracking-tight">
                PetPals
              </span>
            </Link>
          </div>

          {/* Right corner - Auth Buttons positioned at the very right edge */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            {renderAuthButtons()}
          </div>
        </div>
      </nav>
    </header>
  );
}
