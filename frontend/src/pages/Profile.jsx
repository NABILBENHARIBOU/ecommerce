import { useAuth } from '../store/AuthContext'
import { User, Mail, Phone, Edit2, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [orders, setOrders] = useState([])
  const [addresses, setAddresses] = useState([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalAddresses: 0,
    totalSpent: 0
  })
  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
  })

  useEffect(() => {
    if (user?.idUtilisateur) {
      fetchUserData()
    }
  }, [user])

  const fetchUserData = async () => {
    try {
      // Récupérer les commandes de l'utilisateur
      const allOrders = await api.getAllOrders()
      const userOrders = allOrders.filter(order => order.idUtilisateur === user?.idUtilisateur)
      setOrders(userOrders)

      // Récupérer les adresses de l'utilisateur
      const allAddresses = await api.get(`/api/adresses/utilisateur/${user?.idUtilisateur}`)
      setAddresses(allAddresses || [])

      // Calculer les statistiques
      const totalSpent = userOrders.reduce((sum, order) => sum + (order.total || 0), 0)
      
      setStats({
        totalOrders: userOrders.length,
        totalAddresses: (allAddresses || []).length,
        totalSpent: totalSpent
      })
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/utilisateurs/${user?.idUtilisateur}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setIsEditing(false)
        // Mettre à jour l'utilisateur local
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {user?.prenom} {user?.nom}
                </h1>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut size={20} />
              Déconnexion
            </button>
          </div>

          {/* Infos personnelles */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Informations personnelles</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit2 size={20} />
                {isEditing ? 'Annuler' : 'Modifier'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Nom</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 font-semibold">{user?.nom}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Prénom</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 font-semibold">{user?.prenom}</p>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <Mail size={18} />
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 font-semibold">{user?.email}</p>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <Phone size={18} />
                  Téléphone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 font-semibold">{user?.telephone || 'Non renseigné'}</p>
                )}
              </div>
            </div>

            {isEditing && (
              <button
                onClick={handleSave}
                className="mt-6 w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Enregistrer les modifications
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.totalOrders}</p>
              <p className="text-gray-600">Commandes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.totalAddresses}</p>
              <p className="text-gray-600">Adresses</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.totalSpent.toFixed(2)} €</p>
              <p className="text-gray-600">Total dépensé</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
