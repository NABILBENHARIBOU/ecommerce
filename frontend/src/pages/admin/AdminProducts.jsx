import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import pour la navigation
import ProductCard from "../../components/ProductCard";
import api from "../../services/api";

export default function AdminProducts({ onEdit, onDelete }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Hook pour naviguer vers une autre route

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error("Erreur API:", err);
        setError("Impossible de charger les produits");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fonction pour naviguer vers la page AddProduct
  const handleAddClick = () => {
    navigate("/admin/add-product");
  };

  const handleDelete = async (id) => {
  if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;

  try {
    await api.deleteProduct(id); // Appel backend pour supprimer
    setProducts((prev) => prev.filter((p) => (p.idProduit ?? p.id) !== id)); // Supprime du state
    alert("Produit supprimé avec succès !");
  } catch (err) {
    console.error(err);
    alert("Erreur lors de la suppression : " + (err.message || "unknown"));
  }
};


  return (
    <div className="admin-products-container p-6">
      {/* Section titre + bouton */}
      <div className="flex justify-between items-center mb-6">
        <header className="w-full bg-white shadow-md p-4 mb-6 rounded-lg border-1 border-gray-300">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">

            {/* Titre */}
            <h1 className="text-2xl font-bold text-gray-800">
              Gestion des Produits
            </h1>

            {/* Zone recherche + bouton */}
            <div className="flex items-center gap-6">

              {/* Recherche */}
              <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-2
                focus-within:ring-2 focus-within:ring-gray-600">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  className="outline-none w-52 text-sm"
                />
              </div>

              {/* Bouton ajouter */}
              <button
                onClick={handleAddClick}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg
               hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter un produit
              </button>

               </div>
          </div>
        </header>


        
      </div>

      {loading && <p>Chargement des produits...</p>}
      {error && <p>{error}</p>}

      <div className="products-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id || p.idProduit} className="relative">
            <ProductCard
              product={p}
              isAdminView={true}
              onEdit={onEdit}
              onDelete={handleDelete}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
