import { useEffect, useState } from 'react'
import { Search, Filter, ShoppingCart, TrendingUp, Clock, CheckCircle, ChevronDown, Trash2 } from 'lucide-react'
import api from '../../services/api'

export default function AdminCommandes() {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedOrder, setExpandedOrder] = useState(null)

  const statusMap = {
    1: { label: 'En attente', color: 'yellow', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800' },
    2: { label: 'En cours', color: 'blue', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' },
    3: { label: 'Livrée', color: 'green', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' },
    4: { label: 'Annulée', color: 'red', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' },
  }

  // Récupération des données depuis le backend
  const fetchOrders = async () => {
    try {
      setLoading(true)
      console.log('📥 Récupération des commandes...')
      const data = await api.getAllOrders()
      console.log('✅ Commandes reçues:', data)
      setOrders(data || [])
      setFilteredOrders(data || [])
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des commandes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // Logique de filtrage (Recherche + Statut)
  useEffect(() => {
    let filtered = orders

    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.statutCommande?.idStatut === parseInt(statusFilter))
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (order) =>
          order.idCommande?.toString().includes(term) ||
          order.utilisateur?.nom?.toLowerCase().includes(term) ||
          order.utilisateur?.prenom?.toLowerCase().includes(term) ||
          order.utilisateur?.email?.toLowerCase().includes(term)
      )
    }

    setFilteredOrders(filtered)
  }, [searchTerm, statusFilter, orders])

  // Calcul des statistiques
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.statutCommande?.idStatut === 1).length,
    processing: orders.filter((o) => o.statutCommande?.idStatut === 2).length,
    delivered: orders.filter((o) => o.statutCommande?.idStatut === 3).length,
  }

  const totalRevenue = orders
    .filter((o) => o.statutCommande?.idStatut !== 4)
    .reduce((sum, order) => sum + (order.total || 0), 0)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price || 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      console.log(`🔄 Mise à jour du statut de la commande ${orderId} vers ${newStatus}`)
      await api.updateOrderStatus(orderId, newStatus)
      console.log('✅ Statut mis à jour')
      fetchOrders()
      setExpandedOrder(null)
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour:', error)
    }
  }

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      try {
        console.log(`🗑️ Suppression de la commande ${orderId}`)
        await api.deleteOrder(orderId)
        console.log('✅ Commande supprimée')
        fetchOrders()
        setExpandedOrder(null)
      } catch (error) {
        console.error('❌ Erreur lors de la suppression:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Chargement des commandes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* En-tête */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Commandes</h1>
              <p className="text-gray-500 mt-1">Tableau de bord administrateur</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-900">{stats.total} commandes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <ShoppingCart className="w-12 h-12 text-blue-100" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">En attente</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
              </div>
              <Clock className="w-12 h-12 text-yellow-100" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">En cours</p>
                <p className="text-3xl font-bold text-gray-900">{stats.processing}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-100" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Livrées</p>
                <p className="text-3xl font-bold text-gray-900">{stats.delivered}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-100" />
            </div>
          </div>
        </div>

        {/* Revenu total */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 shadow-md text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Revenu total</p>
              <p className="text-4xl font-bold">{formatPrice(totalRevenue)}</p>
            </div>
            <TrendingUp className="w-16 h-16 text-blue-300 opacity-50" />
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par ID, nom, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>
            <div className="flex gap-2 items-center">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
              >
                <option value="all">Tous les statuts</option>
                <option value="1">En attente</option>
                <option value="2">En cours</option>
                <option value="3">Livrée</option>
                <option value="4">Annulée</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des commandes */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucune commande trouvée</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Client</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Statut</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => {
                    const status = statusMap[order.statutCommande?.idStatut] || statusMap[1]
                    const isExpanded = expandedOrder === order.idCommande
                    return (
                      <tbody key={`order-${order.idCommande}`}>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-mono text-sm font-semibold text-blue-600">#{order.idCommande}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              <p className="font-medium text-gray-900">
                                {order.utilisateur?.prenom} {order.utilisateur?.nom}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-600">{order.utilisateur?.email}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-semibold text-gray-900">{formatPrice(order.total)}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.border} border ${status.text}`}>
                              {status.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatDate(order.dateCommande)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => setExpandedOrder(isExpanded ? null : order.idCommande)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition"
                              title="Voir les détails"
                            >
                              <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                          </td>
                        </tr>
                        
                        {isExpanded && (
                          <tr className="bg-gray-50 border-t-2 border-blue-200">
                            <td colSpan="7" className="px-6 py-4">
                              <div className="space-y-4">
                                {/* Informations du client */}
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-2">📋 Adresse de livraison</h4>
                                  <div className="bg-white p-3 rounded border border-gray-200 text-sm text-gray-700">
                                    <p>{order.adresse?.rue}</p>
                                    <p>{order.adresse?.codePostal} {order.adresse?.ville}</p>
                                    <p>{order.adresse?.pays}</p>
                                  </div>
                                </div>

                                {/* Articles */}
                                {order.lignesCommande && order.lignesCommande.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">🛒 Articles</h4>
                                    <div className="space-y-2">
                                      {order.lignesCommande.map((ligne, idx) => (
                                        <div key={`ligne-${idx}`} className="bg-white p-3 rounded border border-gray-200 flex justify-between items-center text-sm">
                                          <div>
                                            <p className="font-medium text-gray-900">
                                              {ligne.produit?.nom || `Produit ${ligne.idProduit}`}
                                            </p>
                                            <p className="text-gray-600">Quantité: {ligne.quantite}</p>
                                          </div>
                                          <p className="font-semibold text-gray-900">
                                            {formatPrice(ligne.prixUnitaire * ligne.quantite)}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Contrôles du statut et actions */}
                                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                                  <select
                                    value={order.statutCommande?.idStatut || '1'}
                                    onChange={(e) => handleUpdateStatus(order.idCommande, parseInt(e.target.value))}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                                  >
                                    <option value="1">En attente</option>
                                    <option value="2">En cours</option>
                                    <option value="3">Livrée</option>
                                    <option value="4">Annulée</option>
                                  </select>

                                  <button
                                    onClick={() => handleDeleteOrder(order.idCommande)}
                                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 text-sm"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Supprimer
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}