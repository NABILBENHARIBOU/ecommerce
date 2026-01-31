import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, CheckCircle, Loader, CreditCard, DollarSign, Plus, X } from 'lucide-react'
import { useCart } from '../store/CartContext'
import { useAuth } from '../store/AuthContext'
import api from '../services/api'

export default function Checkout() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items, clearCart } = useCart()
  
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [paymentMethods, setPaymentMethods] = useState([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [newAddress, setNewAddress] = useState({
    rue: '',
    ville: '',
    codePostal: '',
    pays: '',
  })

  // Obtenir l'ID utilisateur (support id_utilisateur et idUtilisateur)
  const userId = user?.id_utilisateur || user?.idUtilisateur

  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  const placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e2e8f0" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="16" fill="%23999" text-anchor="middle" dy=".3em"%3ENon disponible%3C/text%3E%3C/svg%3E' 

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Vérifier que l'ID utilisateur existe
        if (!userId) {
          setError('ID utilisateur non trouvé. Veuillez vous reconnecter.')
          return
        }

        // Récupérer les adresses de l'utilisateur
        const userAddresses = await api.get(`/api/adresses/utilisateur/${userId}`)
        setAddresses(userAddresses || [])
        if (userAddresses && userAddresses.length > 0) {
          setSelectedAddress(userAddresses[0].id_adresse)
        }

        // Récupérer les modes de paiement
        const modes = await api.get('/api/modes-paiement')
        console.log('Modes de paiement reçus:', modes)
        setPaymentMethods(modes || [])
        if (modes && modes.length > 0) {
          setSelectedPaymentMethod(modes[0].id_mode || modes[0].idMode)
        }
      } catch (err) {
        setError('Erreur lors du chargement des données: ' + err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, userId, navigate])

  const handleAddAddress = async () => {
    try {
      setProcessing(true)
      setError(null)

      // Créer la nouvelle adresse
      const adresseData = {
        ...newAddress,
        idUtilisateur: userId,
      }
      const createdAddress = await api.post('/api/adresses', adresseData)
      
      // Ajouter la nouvelle adresse à la liste
      setAddresses([...addresses, createdAddress])
      
      // Sélectionner la nouvelle adresse
      setSelectedAddress(createdAddress.id_adresse || createdAddress.idAdresse)
      
      // Réinitialiser le formulaire
      setNewAddress({ rue: '', ville: '', codePostal: '', pays: '' })
      setShowAddressForm(false)
      setError(null)
      setProcessing(false)
    } catch (err) {
      setError('Erreur lors de la création de l\'adresse: ' + err.message)
      setProcessing(false)
    }
  }

  const handleSubmitOrder = async (e) => {
    e.preventDefault()
    
    console.log('📋 Tentative de création de commande...')
    console.log('👤 User ID:', userId)
    console.log('📍 Adresse sélectionnée:', selectedAddress)
    console.log('💳 Mode de paiement:', selectedPaymentMethod)
    console.log('🛒 Articles:', items)

    if (!userId) {
      setError('ID utilisateur non valide. Veuillez vous reconnecter.')
      return
    }

    if (!selectedAddress) {
      setError('Veuillez sélectionner une adresse de livraison')
      return
    }

    if (!selectedPaymentMethod) {
      setError('Veuillez sélectionner un mode de paiement')
      return
    }

    if (items.length === 0) {
      setError('Votre panier est vide')
      return
    }

    try {
      setProcessing(true)
      setError(null)

      // Préparer les données de commande
      const orderData = {
        idUtilisateur: userId,
        idAdresse: selectedAddress,
        total: total,
        lignesCommande: items.map(item => ({
          idProduit: item.id,
          quantite: item.quantity,
          prixUnitaire: item.price,
        })),
      }
      
      console.log('📤 Envoi des données de commande:', orderData)

      // Créer la commande
      const newOrder = await api.createOrder(orderData)
      console.log('✅ Commande créée avec succès:', newOrder)
      
      // Créer le paiement
      if (selectedPaymentMethod) {
        console.log('💳 Création du paiement avec mode:', selectedPaymentMethod)
        const payment = await api.createPaymentForOrder(newOrder.idCommande || newOrder.id_commande, selectedPaymentMethod)
        console.log('✅ Paiement créé avec succès:', payment)
      }

      setSuccess(true)
      clearCart()
      
      console.log('🎉 Commande finalisée avec succès!')
      
      // Rediriger vers la page de confirmation après 2 secondes
      setTimeout(() => {
        navigate(`/order-confirmation/${newOrder.idCommande || newOrder.id_commande}`)
      }, 2000)
    } catch (err) {
      console.error('❌ Erreur lors de la création de la commande:', err)
      setError('Erreur lors de la création de la commande: ' + err.message)
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-gray-50 to-gray-100 p-5 md:p-10">
        <div className="flex flex-col items-center justify-center gap-5 bg-white rounded-lg p-16 shadow-md">
          <Loader className="w-12 h-12 animate-spin text-blue-600" />
          <p className="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    )
  }

  if (items.length === 0 && !success) {
    return (
      <div className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-gray-50 to-gray-100 p-5 md:p-10">
        <div className="flex flex-col items-center justify-center gap-5 bg-white rounded-lg p-16 shadow-md">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h2 className="text-2xl font-bold text-gray-900">Votre panier est vide</h2>
          <button 
            onClick={() => navigate('/')} 
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continuer les achats
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-5 md:px-0">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Finaliser votre commande</h1>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3 items-start">
            <CheckCircle size={24} className="text-green-600 flex-shrink-0" />
            <p className="text-green-800 font-medium">Commande créée avec succès! Redirection en cours...</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 items-start">
            <AlertCircle size={24} className="text-red-600 flex-shrink-0" />
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg p-6 md:p-8 shadow-md">
            <form onSubmit={handleSubmitOrder}>
              {/* Section Adresse */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4 pb-3 border-b-2 border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Adresse de livraison</h2>
                  {!showAddressForm && (
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(true)}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      title="Ajouter une nouvelle adresse"
                    >
                      <Plus size={18} />
                    </button>
                  )}
                </div>

                {showAddressForm && (
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-5 mb-5">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Nouvelle adresse</h3>
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="text-gray-600 hover:text-gray-900 p-1"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder="Rue et numéro"
                        value={newAddress.rue}
                        onChange={(e) => setNewAddress({ ...newAddress, rue: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Ville"
                        value={newAddress.ville}
                        onChange={(e) => setNewAddress({ ...newAddress, ville: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Code postal"
                        value={newAddress.codePostal}
                        onChange={(e) => setNewAddress({ ...newAddress, codePostal: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                      />
                    </div>

                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder="Pays"
                        value={newAddress.pays}
                        onChange={(e) => setNewAddress({ ...newAddress, pays: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                        required
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAddAddress}
                      disabled={processing || !newAddress.rue || !newAddress.ville || !newAddress.pays}
                      className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {processing ? 'Ajout en cours...' : 'Ajouter cette adresse'}
                    </button>
                  </div>
                )}

                {addresses.length === 0 && !showAddressForm ? (
                  <div className="bg-gray-50 p-5 rounded-lg text-center text-gray-600">
                    <p>Aucune adresse disponible</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {addresses.map((addr) => {
                      const addrId = addr.id_adresse ?? addr.idAdresse
                      return (
                        <label key={`addr-${addrId}`} className="flex items-start gap-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
                          <input
                            type="radio"
                            name="address"
                            value={addrId}
                            checked={selectedAddress === addrId}
                            onChange={(e) => setSelectedAddress(parseInt(e.target.value))}
                            className="mt-1 w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              {addr.typeAdresse?.libelle || 'Adresse'} - {addr.codePostal}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {addr.rue}, {addr.codePostal} {addr.ville}, {addr.pays}
                            </p>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Section Mode de paiement */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-3 border-b-2 border-gray-200">Mode de paiement</h2>
                {paymentMethods.length === 0 ? (
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">Aucun mode de paiement disponible</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {paymentMethods.map((method) => {
                      const methodId = method.id_mode ?? method.idMode
                      return (
                        <label key={`payment-${methodId}`} className="flex items-start gap-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
                          <input
                            type="radio"
                            name="payment"
                            value={methodId}
                            checked={selectedPaymentMethod === methodId}
                            onChange={(e) => setSelectedPaymentMethod(parseInt(e.target.value))}
                            className="mt-1 w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              {method.libelle?.includes('Carte') && <CreditCard size={20} className="text-blue-600" />}
                              {method.libelle?.includes('PayPal') && <span className="text-xl">🅿️</span>}
                              {method.libelle?.includes('Virement') && <DollarSign size={20} className="text-green-600" />}
                              {method.libelle?.includes('livraison') && <span className="text-xl">🚚</span>}
                              {!method.libelle?.includes('Carte') && 
                               !method.libelle?.includes('PayPal') && 
                               !method.libelle?.includes('Virement') && 
                               !method.libelle?.includes('livraison') && <span className="text-xl">💳</span>}
                              <p className="font-semibold text-gray-900">{method.libelle}</p>
                            </div>
                            <p className="text-gray-600 text-sm">
                              {method.libelle?.includes('Carte') && 'Paiement sécurisé par carte'}
                              {method.libelle?.includes('PayPal') && 'Via votre compte PayPal'}
                              {method.libelle?.includes('Virement') && 'Virement bancaire'}
                              {method.libelle?.includes('livraison') && 'Paiement à la réception'}
                            </p>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={processing || !selectedAddress}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Traitement...
                  </>
                ) : (
                  `Confirmer la commande (${total.toFixed(2)} €)`
                )}
              </button>
            </form>
          </div>

          {/* Résumé de la commande */}
          <div className="bg-white rounded-lg p-6 md:p-8 shadow-md h-fit sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-3 border-b-2 border-gray-200">Résumé de votre commande</h2>
            
            <div className="mb-6 max-h-64 overflow-y-auto">
              {items.map((item, index) => {
                const image = item.image_url && item.image_url.startsWith('/') ? `http://localhost:8080${item.image_url}` : (item.image_url || placeholder)
                return (
                  <div key={`item-${item.id}-${index}`} className="flex justify-between items-start mb-4 pb-4 border-b border-gray-200 last:border-0">
                    <div className="flex items-center gap-3 flex-1">
                      <img src={image} alt={item.name} className="w-16 h-12 object-cover rounded-md" />
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {(item.quantity * item.price).toFixed(2)} €
                    </p>
                  </div>
                )
              })}
            </div>
            
            <div className="space-y-3 mb-6 pb-6 border-b-2 border-gray-200">
              <div className="flex justify-between text-gray-700">
                <span>Sous-total:</span>
                <span>{total.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Frais de livraison:</span>
                <span>0.00 €</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total:</span>
                <span>{total.toFixed(2)} €</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Informations client</h3>
              <p className="font-medium text-gray-900">{user.nom} {user.prenom}</p>
              <p className="text-gray-600 text-sm">{user.email}</p>
              {user.telephone && <p className="text-gray-600 text-sm">{user.telephone}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
