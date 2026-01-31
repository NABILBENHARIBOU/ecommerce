import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Download, AlertCircle, Loader, Package, CheckCircle, Truck } from 'lucide-react'
import { useAuth } from '../store/AuthContext'
import api from '../services/api'

export default function MyOrders() {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  // Obtenir l'ID utilisateur (support id_utilisateur et idUtilisateur)
  const userId = user?.id_utilisateur || user?.idUtilisateur

  const statusConfig = {
    'En attente': { color: '#ffc107', icon: '⏳', label: 'En attente' },
    'En cours': { color: '#17a2b8', icon: '📦', label: 'En cours' },
    'Expédiée': { color: '#20c997', icon: '🚚', label: 'Expédiée' },
    'Livrée': { color: '#28a745', icon: '✓', label: 'Livrée' },
    'Annulée': { color: '#dc3545', icon: '✕', label: 'Annulée' },
  }

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    fetchOrders()
  }, [user, userId, navigate])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      if (!userId) {
        setError('ID utilisateur non trouvé')
        setOrders([])
        return
      }
      const data = await api.getOrdersByUser(userId)
      setOrders(data || [])
      setError(null)
    } catch (err) {
      setError('Erreur lors du chargement des commandes: ' + err.message)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.libelleStatut === filterStatus)

  const handleViewDetails = (order) => {
    setSelectedOrder(order)
  }

  const handleCloseDetails = () => {
    setSelectedOrder(null)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status) => {
    return statusConfig[status]?.color || '#666'
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-slate-100 to-slate-50 px-5 py-10">
        <div className="max-w-4xl mx-auto bg-white rounded-xl p-16 shadow-md flex flex-col items-center justify-center gap-5">
          <Loader className="w-12 h-12 animate-spin text-blue-500" />
          <p className="text-gray-600">Chargement de vos commandes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-slate-100 to-slate-50 px-5 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Mes commandes</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
            <p className="text-red-700 flex-1">{error}</p>
            <button onClick={fetchOrders} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold transition">
              Réessayer
            </button>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl p-16 shadow-md flex flex-col items-center justify-center gap-5">
            <Package size={48} className="text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-900">Aucune commande</h2>
            <p className="text-gray-600">Vous n'avez pas encore de commande</p>
            <button onClick={() => navigate('/')} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition">
              Commencer vos achats
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white p-4 rounded-lg shadow">
              <div className="flex items-center gap-3">
                <label htmlFor="status-filter" className="font-semibold text-gray-700">Filtrer par statut:</label>
                <select
                  id="status-filter"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Toutes les commandes</option>
                  {Object.entries(statusConfig).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>
              <p className="text-sm text-gray-600">
                {filteredOrders.length} commande{filteredOrders.length > 1 ? 's' : ''}
              </p>
            </div>

            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const status = statusConfig[order.libelleStatut] || {}
                return (
                  <div key={order.idCommande} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Commande N°</p>
                        <p className="text-lg font-bold text-gray-900">#{order.idCommande.toString().padStart(6, '0')}</p>
                      </div>
                      <div className="px-4 py-2 rounded-full text-white text-sm font-semibold" style={{backgroundColor: status.color}}>
                        <span>{status.icon} {status.label}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pb-4 border-b">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Date</p>
                        <p className="text-sm font-semibold text-gray-900">{formatDate(order.date)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Montant</p>
                        <p className="text-sm font-semibold text-blue-600">{order.total.toFixed(2)} €</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Articles</p>
                        <p className="text-sm font-semibold text-gray-900">{order.lignesCommande?.length || 0} article{order.lignesCommande?.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                      >
                        <Eye size={16} />
                        Voir détails
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold transition">
                        <Download size={16} />
                        Facture
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Modal pour les détails de commande */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={handleCloseDetails}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Détails de commande #{selectedOrder.idCommande.toString().padStart(6, '0')}</h2>
              <button onClick={handleCloseDetails} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">✕</button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Informations de livraison</h3>
                <p className="text-gray-700 mb-3">{selectedOrder.adresseComplete}</p>
                <div className="px-3 py-2 rounded-lg" style={{backgroundColor: status.color + '20', borderLeft: `4px solid ${status.color}`}}>
                  <p className="text-sm">Statut actuel: <strong style={{ color: getStatusColor(selectedOrder.libelleStatut) }}>
                    {selectedOrder.libelleStatut}
                  </strong></p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3">Articles commandés</h3>
                <div className="space-y-2">
                  {selectedOrder.lignesCommande?.map((ligne) => (
                    <div key={ligne.idLigne} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">{ligne.nomProduit}</p>
                        <p className="text-sm text-gray-600">Qty: {ligne.quantite} × {ligne.prixUnitaire.toFixed(2)} €</p>
                      </div>
                      <p className="font-semibold text-gray-900">{ligne.sousTotal.toFixed(2)} €</p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.paiement && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Informations de paiement</h3>
                  <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Mode de paiement:</span>
                      <span className="font-semibold text-gray-900">{selectedOrder.paiement.libelleMode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Montant payé:</span>
                      <span className="font-semibold text-blue-600">{selectedOrder.paiement.montant.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Date de paiement:</span>
                      <span className="font-semibold text-gray-900">{formatDate(selectedOrder.paiement.datePaiement)}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Sous-total:</span>
                  <span className="font-semibold text-gray-900">{selectedOrder.total.toFixed(2)} €</span>
                </div>
                <div className="border-t border-blue-200 pt-2 flex justify-between">
                  <span className="font-bold text-gray-900">Total:</span>
                  <span className="text-lg font-bold text-blue-600">{selectedOrder.total.toFixed(2)} €</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border-t border-gray-200 p-6 flex gap-2">
              <button onClick={handleCloseDetails} className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 px-4 py-2 rounded-lg font-semibold transition">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
