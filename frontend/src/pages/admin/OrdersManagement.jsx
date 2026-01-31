import { useEffect, useState } from 'react';
import { Search, Filter, Eye, Trash2, AlertCircle, Loader, ChevronDown } from 'lucide-react';
import api from '../../services/api';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sortBy, setSortBy] = useState('date');

  const statuses = [
    { id: 1, label: 'En attente' },
    { id: 2, label: 'En cours' },
    { id: 3, label: 'Expédiée' },
    { id: 4, label: 'Livrée' },
    { id: 5, label: 'Annulée' },
  ];

  const statusColors = {
    'En attente': { color: '#ffc107', bgColor: 'rgba(255, 193, 7, 0.1)' },
    'En cours': { color: '#17a2b8', bgColor: 'rgba(23, 162, 184, 0.1)' },
    'Expédiée': { color: '#20c997', bgColor: 'rgba(32, 201, 151, 0.1)' },
    'Livrée': { color: '#28a745', bgColor: 'rgba(40, 167, 69, 0.1)' },
    'Annulée': { color: '#dc3545', bgColor: 'rgba(220, 53, 69, 0.1)' },
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, sortBy, orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAllOrders();
      setOrders(data || []);
    } catch (err) {
      setError('Erreur lors du chargement des commandes: ' + err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...orders];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.idCommande.toString().includes(term) ||
          order.nomUtilisateur.toLowerCase().includes(term) ||
          order.emailUtilisateur.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.libelleStatut === statusFilter);
    }

    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'amount') {
      filtered.sort((a, b) => b.total - a.total);
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.nomUtilisateur.localeCompare(b.nomUtilisateur));
    }

    setFilteredOrders(filtered);
  };

  const deleteOrder = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette commande?')) return;

    try {
      await api.deleteOrder(id);
      setOrders(orders.filter((order) => order.idCommande !== id));
      setSelectedOrder(null);
    } catch (error) {
      setError('Erreur lors de la suppression: ' + error.message);
    }
  };

  const updateOrderStatus = async (id, newStatusLabel) => {
    try {
      const statusObj = statuses.find(s => s.label === newStatusLabel);
      if (!statusObj) return;

      await api.updateOrderStatus(id, statusObj.id);
      
      // Recharger les commandes
      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      setError('Erreur lors de la mise à jour du statut: ' + error.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader className="w-12 h-12 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600 text-lg">Chargement des commandes...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des commandes</h1>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Actualiser
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-800">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-700 font-bold text-lg"
            >
              ×
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par N°, client ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">Tous les statuts</option>
              {statuses.map((status) => (
                <option key={status.id} value={status.label}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <ChevronDown className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="date">Tri: Date (récent)</option>
              <option value="amount">Tri: Montant (élevé)</option>
              <option value="name">Tri: Nom (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">N° Commande</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Client</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Articles</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Montant</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Statut</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      Aucune commande trouvée
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const statusInfo = statusColors[order.libelleStatut] || {};
                    return (
                      <tr key={order.idCommande} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900">#{order.idCommande.toString().padStart(6, '0')}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{order.nomUtilisateur}</p>
                            <p className="text-sm text-gray-500">{order.emailUtilisateur}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(order.date)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {order.lignesCommande?.length || 0} article(s)
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          {order.total.toFixed(2)} €
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="inline-flex px-3 py-1 rounded-full text-sm font-medium border-none"
                            style={{
                              background: statusInfo.bgColor,
                              color: statusInfo.color,
                              borderColor: statusInfo.color,
                            }}
                          >
                            {order.libelleStatut}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Voir détails"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => deleteOrder(order.idCommande)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Supprimer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {selectedOrder && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedOrder(null)}
          >
            <div
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gray-100 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  Détails de commande #{selectedOrder.idCommande.toString().padStart(6, '0')}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-2xl text-gray-600 hover:text-gray-900"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Client Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Informations client</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Nom:</p>
                      <p className="font-medium text-gray-900">{selectedOrder.nomUtilisateur}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email:</p>
                      <p className="font-medium text-gray-900">{selectedOrder.emailUtilisateur}</p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Adresse de livraison</h3>
                  <p className="text-gray-700">{selectedOrder.adresseComplete}</p>
                </div>

                {/* Items */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Articles commandés</h3>
                  <div className="space-y-3 border border-gray-200 rounded-lg p-4">
                    {selectedOrder.lignesCommande?.map((ligne) => (
                      <div key={ligne.idLigne} className="flex justify-between items-start border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                        <div>
                          <p className="font-medium text-gray-900">{ligne.nomProduit}</p>
                          <p className="text-sm text-gray-600">Qty: {ligne.quantite} × {ligne.prixUnitaire.toFixed(2)} €</p>
                        </div>
                        <p className="font-semibold text-gray-900">{ligne.sousTotal.toFixed(2)} €</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Management */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Gestion du statut</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Statut actuel: <strong className="text-gray-900">{selectedOrder.libelleStatut}</strong>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {statuses.map((status) => (
                      <button
                        key={status.id}
                        onClick={() => updateOrderStatus(selectedOrder.idCommande, status.label)}
                        className="px-4 py-2 rounded-lg font-medium transition"
                        style={
                          status.label === selectedOrder.libelleStatut
                            ? {
                                background: statusColors[status.label]?.color,
                                color: 'white',
                              }
                            : {
                                border: `2px solid ${statusColors[status.label]?.color}`,
                                color: statusColors[status.label]?.color,
                              }
                        }
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Sous-total:</span>
                    <span className="text-gray-900">{selectedOrder.total.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-gray-900">{selectedOrder.total.toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-100 border-t border-gray-200 px-6 py-4">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersManagement;