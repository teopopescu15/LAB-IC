"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
  price: number;
  category: string;
  subcategory: string | null;
  promoted: boolean;
  countyRaw: string;
  cityRaw: string;
  serviceType: string | null;
}

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const petsPerPage = 30;

  const [filters, setFilters] = useState({
    species: "all",
    gender: "all",
    size: "all",
    location: "all",
    category: "all",
    price: "all",
    promoted: "all",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    locations: [] as string[],
    categories: [] as string[],
  });

  // Calculate pagination data
  const totalPages = Math.ceil(filteredPets.length / petsPerPage);
  const startIndex = (currentPage - 1) * petsPerPage;
  const endIndex = startIndex + petsPerPage;
  const currentPets = filteredPets.slice(startIndex, endIndex);

  useEffect(() => {
    fetchPets();
  }, []);

  // Extract filter options when pets data is loaded
  useEffect(() => {
    if (pets.length > 0) {
      // Extract unique counties for location filter
      const locations = Array.from(
        new Set(pets.map((pet) => pet.countyRaw))
      ).sort();

      // Extract unique categories
      const categories = Array.from(
        new Set(pets.map((pet) => pet.category))
      ).sort();

      setFilterOptions({
        locations,
        categories,
      });
    }
  }, [pets]);

  // Apply filters and search whenever they change
  useEffect(() => {
    if (pets.length > 0) {
      const filtered = pets.filter((pet) => {
        // Check if pet matches all selected filters
        if (filters.species !== "all" && pet.species !== filters.species)
          return false;
        if (filters.gender !== "all" && pet.gender !== filters.gender)
          return false;
        if (filters.size !== "all" && pet.size !== filters.size) return false;
        if (filters.location !== "all" && pet.countyRaw !== filters.location)
          return false;
        if (filters.category !== "all" && pet.category !== filters.category)
          return false;
        if (filters.promoted !== "all") {
          if (filters.promoted === "yes" && !pet.promoted) return false;
          if (filters.promoted === "no" && pet.promoted) return false;
        }

        if (filters.price !== "all") {
          if (filters.price === "under500" && pet.price >= 500) return false;
          if (
            filters.price === "500to1000" &&
            (pet.price < 500 || pet.price > 1000)
          )
            return false;
          if (
            filters.price === "1000to2000" &&
            (pet.price < 1000 || pet.price > 2000)
          )
            return false;
          if (filters.price === "over2000" && pet.price <= 2000) return false;
        }

        // Check if pet matches search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            pet.name.toLowerCase().includes(query) ||
            pet.breed.toLowerCase().includes(query) ||
            pet.location.toLowerCase().includes(query) ||
            pet.description.toLowerCase().includes(query) ||
            (pet.subcategory &&
              pet.subcategory.toLowerCase().includes(query)) ||
            (pet.serviceType && pet.serviceType.toLowerCase().includes(query))
          );
        }

        return true;
      });

      setFilteredPets(filtered);
      // Reset to first page when filters change
      setCurrentPage(1);
    }
  }, [pets, filters, searchQuery]);

  async function fetchPets() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/pets");

      if (!response.ok) {
        throw new Error(`Error fetching pets: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setPets(data);
      setFilteredPets(data);
    } catch (error) {
      console.error("Failed to fetch pets:", error);
      setError(
        "Nu am putut încărca datele. Te rugăm să încerci din nou mai târziu."
      );
    } finally {
      setIsLoading(false);
    }
  }

  // Pagination helper functions
  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

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
          {/* Results count */}
          {!isLoading && !error && (
            <p className="text-sm text-gray-500 mt-2">
              Afișăm {startIndex + 1}-{Math.min(endIndex, filteredPets.length)}{" "}
              din {filteredPets.length} rezultate
              {currentPage > 1 && ` (Pagina ${currentPage} din ${totalPages})`}
            </p>
          )}
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search Bar */}
            <div className="lg:col-span-4 text-gray-900">
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
              <option value="other">Alte specii</option>
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
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
            >
              <option value="all">Toate categoriile</option>
              {filterOptions.categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              className="px-4 py-2 rounded-full border border-gray-200 focus:ring-2 focus:ring-purple-600"
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
            >
              <option value="all">Toate locațiile</option>
              {filterOptions.locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
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
              value={filters.price}
              onChange={(e) =>
                setFilters({ ...filters, price: e.target.value })
              }
            >
              <option value="all">Toate prețurile</option>
              <option value="under500">Sub 500 lei</option>
              <option value="500to1000">500-1000 lei</option>
              <option value="1000to2000">1000-2000 lei</option>
              <option value="over2000">Peste 2000 lei</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
            <p className="text-red-700">{error}</p>
            <button onClick={fetchPets} className="mt-2 text-red-700 underline">
              Încearcă din nou
            </button>
          </div>
        )}

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
          /* Pets Grid - Now showing only current page pets */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPets.map((pet) => (
              <div
                key={pet.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 ${
                  pet.promoted ? "ring-2 ring-yellow-400" : ""
                }`}
              >
                <div className="relative h-64">
                  <img
                    src={pet.imageUrl}
                    alt={pet.name}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                      {pet.location}
                    </span>
                  </div>
                  {pet.promoted && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                        Promovat
                      </span>
                    </div>
                  )}
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
                  <div className="flex gap-2 mb-3 flex-wrap">
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-sm">
                      {pet.breed}
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                      {pet.gender === "male" ? "Mascul" : "Femelă"}
                    </span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
                      {pet.category}
                    </span>
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm font-semibold">
                      {pet.price} lei
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {pet.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <Link
                      href={pet.originalLink}
                      target="_blank"
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

        {/* Pagination Controls */}
        {!isLoading && !error && filteredPets.length > 0 && totalPages > 1 && (
          <div className="mt-12 mb-8">
            <div className="flex flex-col items-center space-y-4">
              {/* Page info */}
              <div className="text-sm text-gray-600">
                Pagina {currentPage} din {totalPages}
                <span className="mx-2">•</span>
                {filteredPets.length} animăluțe găsite
              </div>

              {/* Pagination buttons */}
              <div className="flex items-center space-x-2">
                {/* Previous button */}
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-600 border border-gray-300"
                  }`}
                >
                  ← Anterior
                </button>

                {/* Page numbers */}
                <div className="flex items-center space-x-1">
                  {getPageNumbers().map((pageNumber, index) => (
                    <span key={index}>
                      {pageNumber === "..." ? (
                        <span className="px-3 py-2 text-gray-400">...</span>
                      ) : (
                        <button
                          onClick={() => goToPage(Number(pageNumber))}
                          className={`px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
                            currentPage === pageNumber
                              ? "bg-purple-600 text-white"
                              : "bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-600 border border-gray-300"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                {/* Next button */}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-600 border border-gray-300"
                  }`}
                >
                  Următor →
                </button>
              </div>

              {/* Quick jump to first/last */}
              {totalPages > 10 && (
                <div className="flex items-center space-x-4 text-sm">
                  <button
                    onClick={() => goToPage(1)}
                    className="text-purple-600 hover:text-purple-800 hover:underline"
                  >
                    Prima pagină
                  </button>
                  <button
                    onClick={() => goToPage(totalPages)}
                    className="text-purple-600 hover:text-purple-800 hover:underline"
                  >
                    Ultima pagină
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* No Results Message */}
        {!isLoading && !error && filteredPets.length === 0 && (
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
