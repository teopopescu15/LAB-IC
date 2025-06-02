"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUserSession();
  }, []);

  async function checkUserSession() {
    try {
      const response = await fetch("/api/auth/session", {
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      const data = await response.json();

      if (data.user) {
        setUser(data.user);
      } else {
        // Redirect to login if not authenticated
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("Failed to check user session", error);
      router.push("/auth/login");
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
        router.push("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Contul meu
            </span>
          </h1>
          <p className="text-lg text-gray-600">
            Gestionează-ți contul și preferințele
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Informații personale
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nume complet
                </label>
                <div className="bg-gray-50 px-4 py-3 rounded-lg border">
                  <span className="text-gray-900 font-medium">{user.name}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresa de email
                </label>
                <div className="bg-gray-50 px-4 py-3 rounded-lg border">
                  <span className="text-gray-900">{user.email}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID utilizator
                </label>
                <div className="bg-gray-50 px-4 py-3 rounded-lg border">
                  <span className="text-gray-600 text-sm font-mono">
                    {user.id}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status cont
                </label>
                <div className="bg-green-50 px-4 py-3 rounded-lg border border-green-200">
                  <span className="text-green-800 font-medium">✅ Activ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 gap-6">
          <Link
            href="/pets"
            className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition-shadow duration-200 group"
          >
            <div className="text-center">
              <div className="text-6xl mb-6">🐾</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Caută animăluțe
              </h3>
              <p className="text-gray-800 text-base">
                Folosește căutarea cu AI pentru a găsi animalul perfect pentru
                tine
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
