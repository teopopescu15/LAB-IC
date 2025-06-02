import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center">
      {/* Background Image Layer with Better Clarity */}
      <div
        className="absolute inset-0 bg-[url('/images/hero-bg-1.jpg')] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundBlendMode: "normal",
          filter: "brightness(1.1) contrast(1.05) saturate(1.1)",
        }}
      />

      {/* Lighter semi-transparent overlay for better clarity */}
      <div className="absolute inset-0 bg-white/30" />

      {/* Content Container - More responsive */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6 lg:space-y-8">
          {/* Hero Text - Much bolder and clearer with text shadows */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight mb-4 lg:mb-6"
            style={{
              textShadow:
                "2px 2px 4px rgba(0,0,0,0.7), 0px 0px 8px rgba(255,255,255,0.8)",
            }}
          >
            <span className="bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent font-black drop-shadow-lg">
              Găsește-ți prietenul
            </span>
            <br />
            <span
              className="text-gray-900 font-black drop-shadow-lg"
              style={{
                textShadow:
                  "2px 2px 4px rgba(0,0,0,0.8), 0px 0px 10px rgba(255,255,255,0.9)",
              }}
            >
              blănos perfect
            </span>
          </h1>
          <p
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-800 max-w-3xl mx-auto leading-relaxed font-bold px-4"
            style={{
              textShadow:
                "1px 1px 3px rgba(0,0,0,0.6), 0px 0px 6px rgba(255,255,255,0.8)",
            }}
          >
            Adoptă un suflet care abia așteaptă să-ți ofere
            <span className="text-purple-700 font-black"> iubire</span>.
            <br className="hidden sm:block" />
            Schimbați-vă viața împreună și începeți o
            <span className="text-blue-700 font-black"> nouă poveste</span>.
          </p>

          {/* Buttons - More responsive spacing with better shadows */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-8 pt-6 lg:pt-8">
            <Link
              href="/auth/login"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-black px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-full text-base sm:text-lg lg:text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition duration-200 border-2 border-blue-800"
              style={{
                textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
              }}
            >
              🐾 Explorează animăluțele
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto bg-white hover:bg-gray-50 text-blue-700 font-black px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-full text-base sm:text-lg lg:text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition duration-200 border-3 border-blue-700"
              style={{
                textShadow: "0px 0px 2px rgba(255,255,255,0.8)",
              }}
            >
              ℹ️ Află mai multe
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
