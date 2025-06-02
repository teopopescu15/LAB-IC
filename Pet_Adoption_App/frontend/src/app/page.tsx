import Hero from "./components/home/Hero";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="text-center space-y-6 sm:space-y-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Bine ai venit în familia{" "}
            <span className="text-blue-600">PetPals</span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Adoptă iubire. Găsește-ți noul prieten pufos aici și începe o{" "}
            <span className="text-purple-600 font-medium">
              poveste frumoasă
            </span>{" "}
            împreună.
          </p>

          {/* Additional content section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-12 lg:mt-16">
            <div className="bg-white p-6 lg:p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="text-4xl mb-4">🐕</div>
              <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-3">
                Câini prietenoși
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Descoperă câini de toate vârstele și rasele care așteaptă o
                familie iubitoare.
              </p>
            </div>

            <div className="bg-white p-6 lg:p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="text-4xl mb-4">🐱</div>
              <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-3">
                Pisici adorabile
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Găsește pisici jucăușe și afectuoase gata să-ți umple casa cu
                bucurie.
              </p>
            </div>

            <div className="bg-white p-6 lg:p-8 rounded-xl shadow-lg border border-gray-100 sm:col-span-2 lg:col-span-1">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-3">
                Adopție responsabilă
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Te ghidăm pas cu pas prin procesul de adopție pentru o
                experiență frumoasă.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
