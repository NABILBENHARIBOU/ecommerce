import { useState, useEffect } from 'react';

const BACKEND_BASE = "http://localhost:8080";

export default function ImageGallery({ product }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!product) return;

    // Si le produit a une seule image
    if (product.imageUrl) {
      const fullUrl = product.imageUrl.startsWith('http')
        ? product.imageUrl
        : `${BACKEND_BASE}${product.imageUrl}`;
      setImages([fullUrl]);
      setSelectedImage(fullUrl);
    } 
    // Si le produit a un tableau d'images
    else if (product.images && product.images.length > 0) {
      const fullImages = product.images.map(img =>
        img.startsWith('http') ? img : `${BACKEND_BASE}${img}`
      );
      setImages(fullImages);
      setSelectedImage(fullImages[0]);
    }
  }, [product]);

  if (!selectedImage) {
    const placeholderSvg = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23e2e8f0" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="16" fill="%23999" text-anchor="middle" dy=".3em"%3EImage non disponible%3C/text%3E%3C/svg%3E';
    return (
      <div className="flex flex-col space-y-4">
        <div className="w-full h-96 rounded-xl overflow-hidden shadow-lg">
          <img src={placeholderSvg} alt="placeholder" className="w-full h-full object-cover" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      {/* Image principale */}
      <div className="w-full h-96 rounded-xl overflow-hidden shadow-lg">
        <img
          src={selectedImage}
          alt={product.nom}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Miniatures */}
      <div className="grid grid-cols-4 gap-3">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(img)}
            className={`border-2 rounded-lg overflow-hidden ${
              selectedImage === img ? 'border-gray-900' : 'border-transparent'
            }`}
          >
            <img src={img} alt={`miniature-${index}`} className="w-full h-20 object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
