import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import api from '../services/api'
import ProductCard from '../components/ui/ProductCard'

export default function Categories() {
  const { id: categoryId } = useParams()
  const navigate = useNavigate()
  
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(categoryId ? parseInt(categoryId) : null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Charger toutes les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.getAllCategories()
        setCategories(data)
        if (categoryId) {
          setSelectedCategory(parseInt(categoryId))
        }
      } catch (err) {
        console.error('Erreur:', err)
        setError('Erreur lors du chargement des catégories')
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [categoryId])

  // Charger les produits selon la catégorie sélectionnée
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const allProducts = await api.getAllProducts()
        
        if (selectedCategory) {
          // Filtrer les produits de la catégorie sélectionnée
          const filtered = allProducts.filter(product =>
            product.categories && product.categories.some(cat => cat.idCategorie === selectedCategory)
          )
          setProducts(filtered)
        } else {
          // Afficher tous les produits
          setProducts(allProducts)
        }
      } catch (err) {
        console.error('Erreur:', err)
        setError('Erreur lors du chargement des produits')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategory])

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId)
  }

  const selectedCategoryName = categories.find(cat => cat.idCategorie === selectedCategory)?.nom

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Nos Catégories</h1>
          <p className="text-gray-600">
            {selectedCategoryName 
              ? `Affichage des produits: ${selectedCategoryName}` 
              : 'Parcourez tous nos produits'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Barre latérale - Catégories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Catégories</h2>
              
              {loading && categories.length === 0 ? (
                <p className="text-gray-500 text-sm">Chargement...</p>
              ) : (
                <div className="space-y-2">
                  {/* Option "Toutes les catégories" */}
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === null
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Toutes les catégories
                  </button>

                  {/* Catégories */}
                  {categories.map(category => (
                    <button
                      key={category.idCategorie}
                      onClick={() => handleCategorySelect(category.idCategorie)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center justify-between ${
                        selectedCategory === category.idCategorie
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>{category.nom}</span>
                      <ChevronRight size={16} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Contenu principal - Produits */}
          <div className="lg:col-span-3">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white rounded-lg h-96 animate-pulse" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <p className="text-gray-600 mb-6 text-sm">
                  {products.length} produit{products.length > 1 ? 's' : ''} trouvé{products.length > 1 ? 's' : ''}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map(product => (
                    <ProductCard
                      key={product.idProduit || product.id}
                      product={product}
                      onEdit={() => {}}
                      onDelete={() => {}}
                      isAdminView={false}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-600 text-lg">Aucun produit trouvé</p>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Voir tous les produits
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
