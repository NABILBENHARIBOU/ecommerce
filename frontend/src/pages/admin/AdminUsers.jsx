import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

export default function AdminUsers() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: ''
  })

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getAllUsers()
      setUsers(data || [])
    } catch (e) {
      setError(e.message || 'Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleEdit = (user) => {
    setEditing(user)
    setFormData({
      nom: user.nom || '',
      prenom: user.prenom || '',
      email: user.email || '',
      telephone: user.telephone || ''
    })
  }

  const handleSave = async () => {
    await api.updateUser(editing.idUtilisateur || editing.id, formData)
    setEditing(null)
    load()
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet utilisateur ?')) return
    await api.deleteUser(id)
    load()
  }

  const getInitials = (prenom, nom) =>
    `${(prenom || '')[0] || ''}${(nom || '')[0] || ''}`.toUpperCase()

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Gestion des utilisateurs
          </h2>
          <button
            onClick={() => navigate('/admin/create-user')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            + Créer un utilisateur
          </button>
        </div>

        <div className="flex gap-6">

          {/* LISTE */}
          <div className="flex-1">
            {loading && <p className="text-gray-500">Chargement...</p>}
            {error && <p className="text-red-600">{error}</p>}
            {!loading && users.length === 0 && (
              <p className="text-gray-500">Aucun utilisateur</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {users.map(u => (
                <div
                  key={u.idUtilisateur || u.id}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition p-5"
                >
                  {/* CARD HEADER */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                      {getInitials(u.prenom, u.nom)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {u.prenom} {u.nom}
                      </p>
                      <p className="text-sm text-gray-500">{u.email}</p>
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Téléphone :</span> {u.telephone || '-'}</p>
                    <p><span className="font-medium">Type :</span> {u.typeUtilisateur || 'Client'}</p>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={() => handleEdit(u)}
                      className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(u.idUtilisateur || u.id)}
                      className="px-3 py-1 rounded-md bg-red-500 hover:bg-red-600 text-white text-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SIDEBAR FORM */}
          {editing && (
            <aside className="w-full md:w-80 bg-white rounded-xl shadow p-6 sticky top-6 h-fit">
              <h3 className="text-lg font-bold mb-4">Modifier utilisateur</h3>

              {['nom', 'prenom', 'email', 'telephone'].map(field => (
                <div key={field} className="mb-3">
                  <label className="block text-sm text-gray-600 capitalize mb-1">
                    {field}
                  </label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    value={formData[field]}
                    onChange={e =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                  />
                </div>
              ))}

              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                >
                  Enregistrer
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg"
                >
                  Annuler
                </button>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
