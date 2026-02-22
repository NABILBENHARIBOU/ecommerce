import { Heart, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import Toast from '../Toast';
import { useCart } from '../../store/CartContext';
import { useAuth } from '../../store/AuthContext';
import { useNavigate } from 'react-router-dom';

const BACKEND_BASE = 'http://localhost:8080';

export default function ProductCard({ product, onEdit, onDelete, isAdminView = false }) {
  const id = product?.idProduit ?? product?.id;
  const { items, addToCart, updateQuantity, removeFromCart } = useCart();
  // Check if product is in cart
  const cartItem = items.find(i => i.id === id);
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const title = product?.nom || product?.name || 'Produit';
  const price = product?.prix ?? product?.price ?? 0;
  const originalPrice = product?.originalPrice ?? product?.prixOriginal ?? null;
  // Si le stock n'est pas défini, on considère qu'il est illimité (Infinity)
  const stock = product?.stock ?? Infinity;

  let image = product?.imageUrl || product?.image || null;
  if (image && image.startsWith('/')) {
    image = BACKEND_BASE + image;
  }

  const imageUrl =
    image ||
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e2e8f0" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="16" fill="%23999" text-anchor="middle" dy=".3em"%3ENon disponible%3C/text%3E%3C/svg%3E';

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    addToCart({
      id,
      name: title,
      price,
      image_url: image,
      stock,
    });

    setToast({ message: 'Produit ajouté au panier !', type: 'success' });
  };

  const discount = originalPrice
    ? Math.round((1 - price / originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 w-full">
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* IMAGE */}
      <div className="relative overflow-hidden bg-slate-100 w-full h-64">
        <div
          className="w-full h-full cursor-pointer"
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

        {/* FAVORIS */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 left-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-md hover:scale-110 transition-all"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600'
            }`}
          />
        </button>

        {/* ADMIN BUTTONS */}
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

      {/* CONTENU */}
      <div className="p-5 space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 line-clamp-2">
          {title}
        </h3>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">
            {price} F CFA
          </span>
          {originalPrice && (
            <span className="text-sm text-slate-400 line-through">
              {originalPrice} F CFA
            </span>
          )}
        </div>

        {!isAdminView && (
          cartItem ? (
            <div className="flex items-center gap-2 w-full justify-between mt-2">
              <button
                onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                disabled={cartItem.quantity <= 1}
                className="p-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded-lg transition-all"
                title="Diminuer la quantité"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="font-semibold text-lg w-8 text-center">{cartItem.quantity}</span>
              <button
                onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                disabled={typeof cartItem.stock === 'number' && isFinite(cartItem.stock) && cartItem.quantity >= cartItem.stock}
                className="p-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded-lg transition-all"
                title="Augmenter la quantité"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button
                onClick={() => removeFromCart(cartItem.id)}
                className="ml-2 px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-700 transition-all"
                title="Retirer du panier"
              >
                Retirer
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300"
            >
              <ShoppingCart className="w-5 h-5" />
              Ajouter au panier
            </button>
          )
        )}
      </div>
    </div>
  );
}