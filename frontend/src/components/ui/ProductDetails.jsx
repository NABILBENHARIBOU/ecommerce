import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShoppingCart, Heart, Truck, Shield, RotateCcw, Star } from "lucide-react";

import ImageGallery from "./ImageGallery";
import ProductInfo from "./ProductInfo";
import ProductFeatures from "./ProductFeatures";

import api from "../../services/api";

const BACKEND_BASE = "http://localhost:8080";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await api.getProduct(id);

        // 🔥 Reconstruction de l'URL de l'image si nécessaire
        if (data.imageUrl && !data.imageUrl.startsWith("http")) {
          data.imageUrl = `${BACKEND_BASE}${data.imageUrl}`;
        }

        setProduct(data);

        if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
        if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);
      } catch (error) {
        console.error("Erreur lors du chargement du produit :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-20 text-xl font-semibold text-gray-600">
        Chargement du produit...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-xl font-semibold text-red-600">
        Produit introuvable.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* 🌟 Colonne de gauche : Galerie d'images */}
        <div className="lg:col-span-1">
          <ImageGallery product={product} />
        </div>

        {/* 🌟 Colonne de droite : Infos produit */}
        <div className="flex flex-col space-y-6">
          {/* Évaluation */}
          <div className="flex items-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(product.rating || 4)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-sm text-gray-600">
              {product.rating || 4.5} ({product.reviews || 12} avis)
            </span>
          </div>

          {/* Nom */}
          <h1 className="text-3xl font-bold text-gray-900">{product.nom}</h1>

          {/* Prix */}
          <div className="flex items-baseline space-x-3">
            <span className="text-4xl font-bold text-gray-900">{product.prix} €</span>
            {product.prixOriginal && (
              <span className="text-2xl text-gray-400 line-through">{product.prixOriginal} €</span>
            )}
          </div>

          {/* Stock */}
          {product.stock > 0 ? (
            <span className="inline-flex items-center text-green-600 font-medium">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
              En stock
            </span>
          ) : (
            <span className="inline-flex items-center text-red-600 font-medium">
              <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
              Rupture de stock
            </span>
          )}

          {/* Description */}
          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* Tailles et couleurs */}
          {(product.colors || product.sizes) && (
            <ProductInfo
              colors={product.colors}
              sizes={product.sizes}
              selectedColor={selectedColor}
              selectedSize={selectedSize}
              onColorChange={setSelectedColor}
              onSizeChange={setSelectedSize}
            />
          )}

          {/* Quantité */}
          <div className="border-t border-b border-gray-200 py-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Quantité
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50"
                >
                  -
                </button>
                <span className="px-6 py-2 font-semibold text-gray-900 border-x border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex space-x-4">
            <button className="flex-1 bg-gray-900 text-white py-4 px-8 rounded-lg font-semibold hover:bg-gray-800 shadow-lg flex items-center justify-center space-x-2">
              <ShoppingCart className="w-5 h-5" />
              <span>Ajouter au panier</span>
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`px-6 py-4 rounded-lg border-2 ${
                isFavorite ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            >
              <Heart
                className={`w-6 h-6 ${
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                }`}
              />
            </button>
          </div>

          {/* Caractéristiques */}
          {product.features && <ProductFeatures features={product.features} />}

          {/* Avantages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-start space-x-3">
              <Truck className="w-5 h-5 text-gray-700" />
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Livraison gratuite</h4>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <RotateCcw className="w-5 h-5 text-gray-700" />
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Retour 30 jours</h4>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-gray-700" />
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Paiement sécurisé</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
