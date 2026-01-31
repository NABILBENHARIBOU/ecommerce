import { TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react'
import api from '../../services/api'

const TopProducts = () => {
  const [top, setTop] = useState([])

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const orders = await api.getAllOrders()
        const map = new Map()

        (orders || []).forEach(order => {
          const lignes = order.lignesCommande || []
          lignes.forEach(l => {
            const id = l.idProduit
            const name = l.nomProduit || `Produit ${id}`
            const qty = l.quantite || 0
            const current = map.get(id) || { id, name, qty: 0 }
            current.qty += qty
            map.set(id, current)
          })
        })

        const arr = Array.from(map.values()).sort((a, b) => b.qty - a.qty).slice(0, 5)
        setTop(arr)
      } catch (err) {
        console.error('Erreur récupération top produits', err)
      }
    }
    fetchTop()
  }, [])

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Meilleurs produits</h2>
        <p className="text-gray-600 text-sm mt-1">Top 5 ventes</p>
      </div>

      <div className="space-y-4">
        {top.length === 0 ? (
          <p className="text-sm text-gray-500">Aucune donnée disponible</p>
        ) : (
          top.map((product, index) => (
            <div key={product.id} className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                  <span className="text-xs font-bold text-gray-600">#{index + 1}</span>
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                <p className="text-xs text-gray-500 mt-1">{product.qty} ventes</p>
              </div>
              <div className={`text-sm font-semibold flex items-center text-emerald-600`}>
                <TrendingUp className="h-4 w-4 ml-1" />
              </div>
            </div>
          ))
        )}
      </div>

      <button className="w-full mt-6 px-4 py-2 text-center text-sm font-medium text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors">
        Voir tous les produits
      </button>
    </div>
  );
};

export default TopProducts;
