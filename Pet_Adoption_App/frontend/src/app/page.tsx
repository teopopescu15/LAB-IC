import Hero from "./components/home/Hero";
export default function Home() {
  return (
    <>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">
          Bine ai venit în familia PetPals
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Adoptă iubire. Găsește-ți noul prieten pufos aici.
        </p>
      </div>
    </>
  );
}
