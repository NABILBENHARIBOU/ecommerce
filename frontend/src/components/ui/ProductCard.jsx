import { Heart, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../../store/CartContext';
import {useAuth} from '../../store/AuthContext';
import { useNavigate } from 'react-router-dom';


const BACKEND_BASE = 'http://localhost:8080';

export default function ProductCard({ product, onEdit, onDelete, isAdminView = false }) {
  const { addToCart } = useCart();
  const {isAuthenticated} = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();


  // Sécurisation des champs selon ton backend
  const id = product?.idProduit ?? product?.id;
  const title = product?.nom || product?.name || 'Produit';
  const description = product?.description || product?.desc || '';
  const price = product?.prix ?? product?.price ?? 0;
  const originalPrice = product?.originalPrice ?? product?.prixOriginal ?? null;
  const stock = product?.stock ?? 0;

  let image = product?.imageUrl || product?.image || null;
  if (image && image.startsWith('/')) {
    image = BACKEND_BASE + image;
  }
  
  // Fallback: image placeholder SVG si pas d'image
  const imageUrl = image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e2e8f0" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="16" fill="%23999" text-anchor="middle" dy=".3em"%3ENon disponible%3C/text%3E%3C/svg%3E';

  const handleAddToCart = () => {
    if(!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname}});
      return;
    }

    addToCart ({
      id: id,
      name: title,
      price: price,
      image_url: image
    });
    console.log("Produit ajouter")
  }
  const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 w-full">
      
      {/* Image */}
      <div className="relative overflow-hidden bg-slate-100 w-full h-64">
        <div 
          className="relative overflow-hidden bg-slate-100 w-full h-64 cursor-pointer"
          onClick={() => navigate(`/product/${id}`)}
        >
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        </div>

        {discount > 0 && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            -{discount}%
          </div>
        )}

        {/* Bouton favoris */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 left-4 bg-white/90 hover:bg-white p-2 rounded-full transition-all duration-200 shadow-md"
        >
          <Heart
            className={`w-5 h-5 transition-all duration-300 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600'
            }`}
          />
        </button>

        {/* Boutons admin */}
        {isAdminView && (
          <div className="absolute bottom-4 right-4 flex gap-2">
            
            <button
              onClick={() => navigate(`/admin/edit-product/${id}`)}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Modifier
            </button>


            <button
              onClick={() => onDelete(id)}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Supprimer
          </button>

          </div>
        )}
      </div>

      {/* Infos produit */}
      <div className="p-5 space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Catégories */}
        {product?.categories && product.categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.categories.map((cat) => (
              <span
                key={cat.idCategorie}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {cat.nom}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-amber-400">★</span>
            ))}
          </div>
          <span className="text-sm text-slate-500">
            ({product?.reviews ?? 0})
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">{price}F CFA</span>
          {originalPrice && (
            <span className="text-sm text-slate-400 line-through">{originalPrice}€</span>
          )}
        </div>
      {!isAdminView && (
        <button
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300 group-hover:scale-105"
        >
          <ShoppingCart className="w-5 h-5" />
          Ajouter au panier
        </button>
)}
      </div>
    </div>
  );
}
