"use client";

import { useState, useEffect, useCallback } from "react";

type Pet = {
  _id: string;
  title: string;
  image_url: string;
  price: number;
  category: string;
  subcategory: string;
  breed: string;
  species: string;
  service: string;
  county: string;
  city: string;
};

export default function ExplorePage() {
  const [filters, setFilters] = useState({
    county: "",
    category: "",
    subcategory: "",
    breed: "",
    service: "",
    species: "",
  });

  const [options, setOptions] = useState<{
    counties: string[];
    categories: string[];
    subcategories: string[];
    breeds: string[];
    services: string[];
    species: string[];
  }>({
    counties: [],
    categories: [],
    subcategories: [],
    breeds: [],
    services: [],
    species: [],
  });

  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Check if any filter is active
  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  // Fetch pets based on filters
  const fetchPets = useCallback(() => {
    setIsLoading(true);
    setSearched(true);

    const qs = new URLSearchParams(
      Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== "")
      )
    ).toString();

    console.log("Fetching with query:", qs);

    fetch(`http://localhost:8000/pets?${qs}`)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        console.log("Received data:", data);
        setPets(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch pets:", error);
        setPets([]);
        setIsLoading(false);
      });
  }, [filters]);

  // Fetch filter options
  useEffect(() => {
    fetch("http://localhost:8000/filters")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch filters");
        return response.json();
      })
      .then((data) => {
        console.log("Filter options:", data);
        setOptions(data);
      })
      .catch((error) => console.error("Failed to fetch filters:", error));
  }, []);

  // Load initial data
  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      county: "",
      category: "",
      subcategory: "",
      breed: "",
      service: "",
      species: "",
    });
    setSearched(false);
  };

  return (
    <div className="p-8">
      <div className="grid grid-cols-3 gap-4 mb-6">
        {(
          [
            "county",
            "category",
            "subcategory",
            "breed",
            "service",
            "species",
          ] as const
        ).map((key) => (
          <div key={key}>
            <label className="block text-sm font-medium capitalize">
              {key}
            </label>
            <select
              value={filters[key]}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, [key]: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">All {key}</option>
              {options[`${key}s` as keyof typeof options]?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="flex space-x-4 mb-6">
        {hasActiveFilters && (
          <button
            onClick={fetchPets}
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        )}
        <button
          onClick={resetFilters}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
        >
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {pets.map((p) => (
          <div key={p._id} className="border p-4 rounded">
            <img
              src={p.image_url}
              alt={p.title}
              className="w-full h-32 object-cover mb-2"
            />
            <h3 className="font-bold">{p.title}</h3>
            <p className="text-sm">{p.price} lei</p>
            <p className="text-xs text-gray-500">
              {p.city}, {p.county}
            </p>
          </div>
        ))}
        {pets.length === 0 && searched && !isLoading && (
          <p className="col-span-4 text-center text-gray-500 mt-8 text-xl">
            Nu am găsit niciun animăluț care să corespundă criteriilor tale de
            căutare.
          </p>
        )}
        {isLoading && (
          <div className="col-span-4 text-center">
            <p>Loading pets...</p>
          </div>
        )}
      </div>
    </div>
  );
}
