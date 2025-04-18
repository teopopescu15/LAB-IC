"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string; // Changed to string to handle various age formats from scraping
  imageUrl: string;
  description: string;
  source: string; // Source website
  originalLink: string; // Original listing URL
  location: string;
  gender: string;
  size: string;
  postedDate: string;
}

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    species: "all",
    gender: "all",
    size: "all",
    location: "all",
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPets();
  }, []);

  async function fetchPets() {
    try {
      const response = await fetch("/api/pets");
      const data = await response.json();
      setPets(data);
    } catch (error) {
      console.error("Failed to fetch pets:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Animăluțe care așteaptă un cămin
            </span>
          </h1>
          <p className="text-lg text-gray-600">
            Descoperă-ți viitorul prieten blănos
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search Bar */}
            <div className="lg:col-span-4">
              <input
                type="text"
                placeholder="Caută după nume, rasă sau locație..."
                className="w-full px-4 py-3 rounded-full border border-gray-200 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Buttons */}
            <select
              className="px-4 py-2 rounded-full border border-gray-200 focus:ring-2 focus:ring-purple-600"
              value={filters.species}
              onChange={(e) =>
                setFilters({ ...filters, species: e.target.value })
              }
            >
              <option value="all">Toate speciile</option>
              <option value="dog">Câini</option>
              <option value="cat">Pisici</option>
            </select>

            <select
              className="px-4 py-2 rounded-full border border-gray-200 focus:ring-2 focus:ring-purple-600"
              value={filters.gender}
              onChange={(e) =>
                setFilters({ ...filters, gender: e.target.value })
              }
            >
              <option value="all">Toate genurile</option>
              <option value="male">Mascul</option>
              <option value="female">Femelă</option>
            </select>

            <select
              className="px-4 py-2 rounded-full border border-gray-200 focus:ring-2 focus:ring-purple-600"
              value={filters.size}
              onChange={(e) => setFilters({ ...filters, size: e.target.value })}
            >
              <option value="all">Toate mărimile</option>
              <option value="small">Mic</option>
              <option value="medium">Mediu</option>
              <option value="large">Mare</option>
            </select>

            <select
              className="px-4 py-2 rounded-full border border-gray-200 focus:ring-2 focus:ring-purple-600"
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
            >
              <option value="all">Toate locațiile</option>
              <option value="bucuresti">București</option>
              <option value="cluj">Cluj</option>
              <option value="iasi">Iași</option>
              {/* Add more cities as needed */}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-md p-4 animate-pulse"
              >
                <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          /* Pets Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <div
                key={pet.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-64">
                  <Image
                    src={pet.imageUrl}
                    alt={pet.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                      {pet.location}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-semibold text-gray-800">
                      {pet.name}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {pet.postedDate}
                    </span>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-sm">
                      {pet.breed}
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                      {pet.gender}
                    </span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
                      {pet.age}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {pet.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <Link
                      href={`/pets/${pet.id}`}
                      className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors duration-200"
                    >
                      Vezi detalii
                    </Link>
                    <a
                      href={pet.originalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-500 hover:text-purple-600"
                    >
                      Sursa: {pet.source}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results Message */}
        {!isLoading && pets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Nu am găsit niciun animăluț care să corespundă criteriilor tale de
              căutare.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
