import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle, AlertCircle, Loader, Home, Package } from 'lucide-react'
import api from '../services/api'

export default function OrderConfirmation() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const data = await api.getOrderById(parseInt(orderId))
        setOrder(data)
      } catch (err) {
        setError('Erreur lors du chargement de la commande: ' + err.message)
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

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

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-slate-100 to-slate-50 px-5 py-10">
        <div className="max-w-2xl mx-auto bg-white rounded-xl p-16 shadow-md text-center flex flex-col items-center gap-5">
          <Loader className="w-12 h-12 animate-spin text-blue-500" />
          <p className="text-gray-600">Chargement de votre commande...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-slate-100 to-slate-50 px-5 py-10">
        <div className="max-w-2xl mx-auto bg-white rounded-xl p-16 shadow-md text-center flex flex-col items-center gap-5">
          <AlertCircle size={48} className="text-red-500" />
          <h2 className="text-2xl font-bold text-gray-900">Erreur</h2>
          <p className="text-gray-600">{error || 'Commande non trouvée'}</p>
          <button onClick={() => navigate('/')} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition">
            <Home size={18} />
            Retour à l'accueil
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-slate-100 to-slate-50 px-5 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 animate-in fade-in slide-in-from-top-5 duration-600">
          <div className="mb-6 flex justify-center">
            <CheckCircle size={80} className="text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Commande confirmée!</h1>
          <p className="text-lg text-gray-600">Merci pour votre achat</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <Package size={24} className="text-blue-500" />
              <h2 className="text-xl font-bold text-gray-900">Détails de la commande</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Numéro de commande:</span>
                <span className="font-semibold text-gray-900">#{order.idCommande.toString().padStart(6, '0')}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Date:</span>
                <span className="font-semibold text-gray-900">{formatDate(order.date)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Statut:</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">{order.libelleStatut}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Montant total:</span>
                <span className="text-xl font-bold text-blue-600">{order.total.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Adresse de livraison</h2>
            <p className="text-gray-700 whitespace-pre-line">{order.adresseComplete}</p>
          </div>

          <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Articles commandés</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Produit</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Quantité</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Prix unitaire</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.lignesCommande?.map((ligne) => (
                    <tr key={ligne.idLigne} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">{ligne.nomProduit}</td>
                      <td className="px-4 py-3 text-center text-gray-900">{ligne.quantite}</td>
                      <td className="px-4 py-3 text-right text-gray-900">{ligne.prixUnitaire.toFixed(2)} €</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">{ligne.sousTotal.toFixed(2)} €</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total:</span>
                <span>{order.total.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Frais de livraison:</span>
                <span>0.00 €</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                <span>Total:</span>
                <span className="text-blue-600">{order.total.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          {order.paiement && (
            <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Informations de paiement</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Mode de paiement:</span>
                  <span className="font-semibold text-gray-900">{order.paiement.libelleMode}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Montant payé:</span>
                  <span className="font-semibold text-green-600">{order.paiement.montant.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Date de paiement:</span>
                  <span className="font-semibold text-gray-900">{formatDate(order.paiement.datePaiement)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-gray-900 mb-3">Prochaines étapes</h3>
          <ul className="space-y-2 text-gray-700 list-disc list-inside">
            <li>Vous recevrez un email de confirmation dans quelques minutes</li>
            <li>Suivi de votre commande disponible dans votre profil</li>
            <li>Livraison estimée: 5-7 jours ouvrables</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={() => navigate('/my-orders')} className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition">
            <Package size={18} />
            Voir mes commandes
          </button>
          <button onClick={() => navigate('/')} className="flex-1 flex items-center justify-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-900 px-6 py-3 rounded-lg font-semibold transition">
            <Home size={18} />
            Continuer les achats
          </button>
        </div>
      </div>
    </div>
  )
}
