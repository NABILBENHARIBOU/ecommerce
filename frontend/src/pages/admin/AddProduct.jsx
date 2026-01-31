import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

export default function AddProduct() {
  const navigate = useNavigate()
  const [nom, setNom] = useState('')
  const [description, setDescription] = useState('')
  const [prix, setPrix] = useState('0.00')
  const [stock, setStock] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  // Charger les catégories au montage
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.getAllCategories()
        setCategories(data)
      } catch (err) {
        console.error('Erreur:', err)
        setError('Erreur lors du chargement des catégories')
      } finally {
        setLoadingCategories(false)
      }
    }
    fetchCategories()
  }, [])

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0]
    if (file) {
      setImageFile(file)
      // Créer un aperçu de l'image
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      // validations côté client pour éviter d'envoyer des valeurs invalides
      if (!nom || !nom.trim()) {
        setError('Le nom du produit est requis')
        setSubmitting(false)
        return
      }

      const prixNumber = Number(prix)
      if (isNaN(prixNumber)) {
        setError('Le prix est invalide')
        setSubmitting(false)
        return
      }

      const stockNumber = Number(stock)
      if (isNaN(stockNumber) || !Number.isFinite(stockNumber)) {
        setError('Le stock est invalide')
        setSubmitting(false)
        return
      }

      let imageUrl = null
      if (imageFile) {
        const res = await api.uploadProductImage(imageFile)
        imageUrl = res.url || res["url"]
      }

      const payload = {
        nom: nom.trim(),
        description: description || '',
        prix: prixNumber,
        stock: Math.floor(stockNumber),
        imageUrl,
        categories: selectedCategories.map(id => ({ idCategorie: id }))
      }

      await api.createProduct(payload)
      alert('Produit ajouté avec succès !')
      navigate('/admin/products')
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'ajout du produit')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8">
            <h2 className="text-3xl font-bold text-white text-center">Ajouter un produit</h2>
          </div>

          {/* Form Container */}
          <div className="p-8 sm:p-10">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded animate-pulse">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Nom */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  Nom du produit <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nom}
                  onChange={e => setNom(e.target.value)}
                  required
                  placeholder="Ex: T-shirt classique"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition duration-200 outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Description détaillée du produit..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition duration-200 outline-none resize-vertical min-h-[120px]"
                />
              </div>

              {/* Photo */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Photo du produit
                </label>
                <div className="flex flex-col gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 cursor-pointer hover:border-blue-500 transition duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-500 file:text-white file:font-semibold hover:file:bg-blue-600"
                  />
                  {imagePreview && (
                    <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <img src={imagePreview} alt="Aperçu" className="max-w-xs max-h-48 rounded-lg object-contain" />
                      <p className="text-sm text-gray-600">Aperçu de l'image</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Prix */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  Prix (F CFA) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={prix}
                  onChange={e => setPrix(e.target.value)}
                  step="0.01"
                  min="0"
                  required
                  placeholder="0.00"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition duration-200 outline-none"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  Stock <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={stock}
                  onChange={e => setStock(e.target.value)}
                  min="0"
                  required
                  placeholder="0"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition duration-200 outline-none"
                />
              </div>

              {/* Catégories */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Catégories
                </label>
                {loadingCategories ? (
                  <p className="text-gray-600 text-sm">Chargement des catégories...</p>
                ) : categories.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    {categories.map(category => (
                      <label key={category.idCategorie} className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition duration-200">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.idCategorie)}
                          onChange={() => handleCategoryChange(category.idCategorie)}
                          className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                        />
                        <span className="text-sm font-medium text-gray-700">{category.nom}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Aucune catégorie disponible</p>
                )}
              </div>

              {/* Boutons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wide"
                >
                  {submitting ? 'Enregistrement...' : 'Ajouter le produit'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin/products')}
                  className="px-8 py-3 bg-gray-400 hover:bg-gray-500 text-white font-bold rounded-lg transition duration-200 uppercase tracking-wide"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
