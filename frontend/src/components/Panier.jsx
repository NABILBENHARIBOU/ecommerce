import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { useCart } from '../store/CartContext';

export default function Panier() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();

  if (!items) return null;

  const handleCheckout = () => {
    if (!user) {
      // Rediriger vers login si pas authentifié
      navigate('/login');
    } else {
      // Rediriger vers checkout
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Votre panier est vide
          </h2>
          <p className="text-gray-600">
            Ajoutez des produits pour commencer vos achats
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Mon Panier</h2>
          <button
            onClick={clearCart}
            className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            Vider le panier
          </button>
        </div>

        {/* Liste des produits */}
        <div className="divide-y divide-gray-200">
          {items.map((item) => (
            <div key={item.id} className="p-6 flex gap-4">
              <img
                src={item.image_url || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%23f0f0f0" width="150" height="150"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="14" fill="%23999" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg"
              />

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {item.name}
                </h3>
                
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg">
                    <button
                      onClick={() => updateQuantity?.(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-2 hover:bg-gray-200 disabled:opacity-50 rounded-lg"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity?.(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-200 rounded-lg"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xl font-bold text-gray-900">
                  {(item.price * item.quantity).toFixed(2)} F CFA
                </p>
                <p className="text-sm text-gray-500 mt-1">{item.price} F CFA / unité</p>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-3xl font-bold text-gray-900">
              {/* Utilisation sécurisée de getTotalPrice ou calcul manuel */}
              {getTotalPrice ? getTotalPrice().toFixed(2) : 0} F CFA
            </span>
          </div>

          <button 
            onClick={handleCheckout}
            className="w-full bg-gray-900 text-white font-semibold py-4 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Passer la commande
          </button>
        </div>
      </div>
    </div>
  );
}