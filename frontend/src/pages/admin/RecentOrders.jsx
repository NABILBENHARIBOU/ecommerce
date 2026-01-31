import { Clock, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useEffect, useState } from 'react'
import api from '../../services/api'

const RecentOrders = () => {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const all = await api.getAllOrders()
        // commandDTOs are sorted by date desc on backend
        setOrders((all || []).slice(0, 5))
      } catch (err) {
        console.error('Erreur en récupérant les commandes récentes', err)
      }
    }
    fetchOrders()
  }, [])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Livré':
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case 'En cours':
      case 'processing':
        return <Loader className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'En attente':
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-600" />;
      case 'Annulé':
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'Livré':
      case 'completed':
        return 'bg-emerald-50';
      case 'En cours':
      case 'processing':
        return 'bg-blue-50';
      case 'En attente':
      case 'pending':
        return 'bg-amber-50';
      case 'Annulé':
      case 'cancelled':
        return 'bg-red-50';
      default:
        return 'bg-gray-50';
    }
  };

  const getStatusText = (status) => {
    if (!status) return ''
    switch (String(status)) {
      case 'completed':
        return 'Livré';
      case 'processing':
        return 'En cours';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulé';
      default:
        return String(status);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">Commandes récentes</h2>
        <p className="text-gray-600 text-sm mt-1">Les 5 dernières commandes</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Commande</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Montant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.idCommande} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-emerald-600">#{order.idCommande}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{order.nomUtilisateur || order.emailUtilisateur || 'Utilisateur'}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{order.total?.toFixed ? `${order.total.toFixed(2)} €` : order.total}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{new Date(order.date).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusBg(order.libelleStatut || order.statut || '')}`}>
                    {getStatusIcon(order.libelleStatut || order.statut)}
                    <span>{getStatusText(order.libelleStatut || order.statut)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-emerald-600 hover:text-emerald-800 font-medium">
                    Détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
        <p className="text-sm text-gray-600">Affichage de {orders.length} commandes</p>
        <button className="px-4 py-2 text-sm font-medium text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors">
          Voir toutes les commandes
        </button>
      </div>
    </div>
  );
};

export default RecentOrders;