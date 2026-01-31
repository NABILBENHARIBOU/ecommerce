import bgImage from "../assets/logo.png"; // par exemple


export default function Hero() {
  return (
    <section
      className="w-full bg-gray-100 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="max-w-7xl mx-auto px-6 py-20 backdrop-brightness-75 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* Texte */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Découvrez notre nouvelle collection
            <span className="text-indigo-300"> exclusive </span>
            2025
          </h1>

          <p className="text-gray-200 mt-4 text-lg">
            Des vêtements premium, un style unique, livrés rapidement chez vous.
            Profitez de promotions exceptionnelles cette semaine.
          </p>

          <div className="mt-8">
            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-lg font-medium shadow-md transition">
              Acheter maintenant
            </button>
          </div>
        </div>

        

      </div>
    </section>
  );
}
