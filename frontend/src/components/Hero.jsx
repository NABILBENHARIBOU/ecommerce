import bgImage from "../assets/logo.png"; // Votre image principale (produit ou mannequin)

export default function Hero() {
  return (
    <section className="w-full bg-gray-100 min-h-[70vh] flex items-center">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* BLOC GAUCHE : Texte */}
        <div className="order-2 md:order-1 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Découvrez notre nouvelle collection
            <span className="text-indigo-600"> exclusive </span>
            2026
          </h1>

          <p className="text-gray-600 mt-6 text-lg md:text-xl leading-relaxed">
            Des vêtements premium, un style unique, livrés rapidement chez vous.
            Profitez de promotions exceptionnelles cette semaine.
          </p>

          <div className="mt-10">
            <button className="w-full md:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-lg font-bold shadow-lg hover:shadow-indigo-200 transition-all transform hover:-translate-y-1">
              Acheter maintenant
            </button>
          </div>
        </div>

        {/* BLOC DROITE : Image */}
        <div className="order-1 md:order-2 flex justify-center">
          <div className="relative w-full max-w-md md:max-w-full">
            {/* Décoration d'arrière-plan optionnelle */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            
            <img 
              src={bgImage} 
              alt="Nouvelle Collection" 
              className="relative rounded-2xl shadow-2xl object-cover w-full h-[300px] md:h-[500px]"
            />
          </div>
        </div>

      </div>
    </section>
  );
}