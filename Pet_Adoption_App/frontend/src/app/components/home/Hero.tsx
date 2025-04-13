import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-gray-900 py-24">
      {/* Background Gradient Layer */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent z-0"></div>

      {/* Background Image Layer */}
      <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-40 z-[-1]"></div>

      {/* Content Container */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl text-white space-y-6">
          {/* Hero Text and Buttons */}
          <h1 className="text-5xl font-extrabold tracking-tight">
            Găsește-ți prietenul blănos perfect
          </h1>
          <p className="text-xl text-gray-200">
            Adoptă un suflet care abia așteaptă să-ți ofere iubire. Schimbați-vă
            viața împreună și începeți o nouă poveste.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
            <Link
              href="/pets"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md text-center transition duration-200"
            >
              Explorează animăluțele
            </Link>
            <Link
              href="/about"
              className="bg-transparent border-2 border-white text-white font-semibold px-6 py-3 rounded-md text-center hover:bg-white hover:text-gray-900 transition duration-200"
            >
              Află mai multe
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
