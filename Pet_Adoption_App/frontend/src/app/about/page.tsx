"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Despre PetPals
            </span>
          </h1>
          <p className="text-lg text-gray-600">
            Platforma inteligentă pentru găsirea animalului de companie perfect
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-8">
              PetPals este o platformă inovatoare care folosește inteligența
              artificială pentru a conecta oamenii cu viitorii lor prieteni
              blănoși. Misiunea noastră este să facem procesul de adopție și
              căutare a animalelor de companie cât mai simplu și eficient
              posibil.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Funcționalități Principale
            </h2>

            <div className="space-y-6">
              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-purple-800 mb-3">
                  🤖 Agent AI Inteligent
                </h3>
                <p className="text-purple-700">
                  Descrie în limbaj natural ce animal cauți, iar agentul nostru
                  AI te va ajuta să găsești potrivirea perfectă din cele 3
                  categorii principale:
                </p>
                <ul className="mt-3 space-y-2 text-purple-700">
                  <li className="flex items-center">
                    <span className="mr-2">🐕</span> Câini - toate rasele și
                    vârstele
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">🐱</span> Pisici - de la pui la
                    adulți
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">💝</span> Adopții - animale care
                    așteaptă un cămin iubitor
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">
                  🎯 Căutare Precisă și Filtrare Inteligentă
                </h3>
                <p className="text-blue-700">
                  Sistemul nostru de căutare avansată înțelege preferințele tale
                  specifice:
                </p>
                <ul className="mt-3 space-y-2 text-blue-700">
                  <li>• Locație specifică (oraș sau județ)</li>
                  <li>• Interval de preț personalizat</li>
                  <li>• Caracteristici specifice ale animalului</li>
                  <li>• Filtrare după rasă și vârstă</li>
                  <li>• Preferințe de temperament și comportament</li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-green-800 mb-3">
                  🎤 Tehnologie Voice-to-Text
                </h3>
                <p className="text-green-700">
                  Experiență de căutare hands-free revoluționară:
                </p>
                <ul className="mt-3 space-y-2 text-green-700">
                  <li>• Conversie vocală în text în timp real</li>
                  <li>• Suport pentru limba română</li>
                  <li>• Procesare naturală a comenzilor vocale</li>
                  <li>• Integrare perfectă cu agentul AI</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link
            href="/pets"
            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity duration-200"
          >
            Începe să cauți 🐾
          </Link>
        </div>
      </div>
    </div>
  );
}
