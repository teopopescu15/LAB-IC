import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center">
      {/* Background Image Layer with Overlay */}
      <div
        className="absolute inset-0 bg-[url('/images/hero-bg-1.jpg')] bg-cover bg-center"
        style={{
          backgroundBlendMode: "overlay",
        }}
      />

      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-white/60" />

      {/* Content Container */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Hero Text and Buttons */}
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Găsește-ți prietenul
            </span>
            <br />
            <span className="text-gray-800">blănos perfect</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
            Adoptă un suflet care abia așteaptă să-ți ofere
            <span className="text-purple-600 font-medium"> iubire</span>.
            <br className="hidden md:block" />
            Schimbați-vă viața împreună și începeți o
            <span className="text-blue-600 font-medium"> nouă poveste</span>.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-4">
            <Link
              href="/pets"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200"
            >
              🐾 Explorează animăluțele
            </Link>
            <Link
              href="/about"
              className="bg-white hover:bg-gray-50 text-blue-600 font-semibold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200 border-2 border-blue-600"
            >
              ℹ️ Află mai multe
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
