import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import api from '../../services/api';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Charger les catégories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await api.getAllCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger les catégories');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      alert('Veuillez entrer un nom de catégorie');
      return;
    }

    setSubmitting(true);
    try {
      await api.createCategory({ nom: newCategoryName });
      setNewCategoryName('');
      alert('Catégorie créée avec succès !');
      await fetchCategories();
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors de la création : ' + (err.message || 'unknown'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;

    try {
      await api.deleteCategory(id);
      alert('Catégorie supprimée avec succès !');
      await fetchCategories();
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors de la suppression : ' + (err.message || 'unknown'));
    }
  };

  const handleStartEdit = (category) => {
    setEditingId(category.idCategorie);
    setEditingName(category.nom);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editingName.trim()) {
      alert('Veuillez entrer un nom de catégorie');
      return;
    }

    setSubmitting(true);
    try {
      await api.updateCategory(editingId, { nom: editingName });
      setEditingId(null);
      setEditingName('');
      alert('Catégorie modifiée avec succès !');
      await fetchCategories();
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors de la modification : ' + (err.message || 'unknown'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Titre */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestion des Catégories</h1>
          <p className="text-gray-600">Créez, modifiez et supprimez les catégories de produits</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Formulaire d'ajout */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Ajouter une nouvelle catégorie</h2>
          <form onSubmit={handleAddCategory} className="flex gap-3">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nom de la catégorie..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={submitting}
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Plus className="w-5 h-5" />
              {submitting ? 'Ajout...' : 'Ajouter'}
            </button>
          </form>
        </div>

        {/* Liste des catégories */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Nom</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-gray-600">
                      Chargement des catégories...
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-gray-600">
                      Aucune catégorie trouvée
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category.idCategorie} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-600">{category.idCategorie}</td>
                      {editingId === category.idCategorie ? (
                        <>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-3">
                              <button
                                onClick={handleUpdateCategory}
                                disabled={submitting}
                                className="text-green-600 hover:text-green-700 font-medium text-sm disabled:opacity-50"
                              >
                                Confirmer
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                disabled={submitting}
                                className="text-gray-600 hover:text-gray-700 font-medium text-sm disabled:opacity-50"
                              >
                                Annuler
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 text-sm text-gray-800">{category.nom}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleStartEdit(category)}
                                className="text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                              >
                                <Edit2 className="w-4 h-4" />
                                Modifier
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(category.idCategorie)}
                                className="text-red-600 hover:text-red-700 transition-colors flex items-center gap-1"
                              >
                                <Trash2 className="w-4 h-4" />
                                Supprimer
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
