import { TrendingUp } from 'lucide-react';

const TopProducts = () => {
  const products = [
    { id: 1, name: 'Produit Premium', sales: 1250, trend: 8.5 },
    { id: 2, name: 'Accessoire Best', sales: 980, trend: -2.3 },
    { id: 3, name: 'Article Elite', sales: 756, trend: 15.2 },
    { id: 4, name: 'Produit Star', sales: 542, trend: 5.1 },
    { id: 5, name: 'Collection Pro', sales: 438, trend: 22.8 },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Meilleurs produits</h2>
        <p className="text-gray-600 text-sm mt-1">Top 5 ventes ce mois</p>
      </div>

      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={product.id} className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                <span className="text-xs font-bold text-gray-600">#{index + 1}</span>
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-900">{product.name}</p>
              <p className="text-xs text-gray-500 mt-1">{product.sales} ventes</p>
            </div>
            <div className={`text-sm font-semibold flex items-center ${product.trend > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {product.trend > 0 ? '+' : ''}{product.trend}%
              {product.trend > 0 && <TrendingUp className="h-4 w-4 ml-1" />}
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 px-4 py-2 text-center text-sm font-medium text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors">
        Voir tous les produits
      </button>
    </div>
  );
};

export default TopProducts;
