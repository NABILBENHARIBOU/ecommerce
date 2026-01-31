export default function ProductInfo({
  colors,
  sizes,
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange
}) {
  return (
    <div className="border-t border-b border-gray-200 py-6 space-y-6">
      {/* Couleurs */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">Couleur</label>
        <div className="flex space-x-3">
          {colors.map((color, index) => (
            <button
              key={index}
              onClick={() => onColorChange(color)}
              className={`w-10 h-10 rounded-full border-2 transition-all ${
                selectedColor.name === color.name
                  ? 'border-gray-900'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color.value }}
            ></button>
          ))}
        </div>
      </div>

      {/* Tailles */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">Taille</label>
        <div className="flex space-x-3">
          {sizes.map((size, index) => (
            <button
              key={index}
              onClick={() => onSizeChange(size)}
              className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                selectedSize === size
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
