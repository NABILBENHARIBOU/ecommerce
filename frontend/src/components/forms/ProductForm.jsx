import { useEffect, useState } from 'react'

export default function ProductForm({ product, onSubmit, onCancel }) {
  const [nom, setNom] = useState('')
  const [description, setDescription] = useState('')
  const [prix, setPrix] = useState('0.00')
  const [stock, setStock] = useState(0)
  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(true)

  // Charger les catégories au montage
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/categories')
        if (!response.ok) throw new Error('Erreur lors du chargement des catégories')
        const data = await response.json()
        setCategories(data)
      } catch (err) {
        console.error('Erreur:', err)
        alert('Erreur lors du chargement des catégories')
      } finally {
        setLoadingCategories(false)
      }
    }
    fetchCategories()
  }, [])

  // Pré-remplir le formulaire si un produit est fourni
  useEffect(() => {
    if (product) {
      setNom(product.nom || product.name || '')
      setDescription(product.description || '')
      setPrix(product.prix != null ? String(product.prix) : (product.price != null ? String(product.price) : '0.00'))
      setStock(product.stock != null ? product.stock : 0)
      // Pré-sélectionner les catégories du produit
      if (product.categories && Array.isArray(product.categories)) {
        setSelectedCategories(product.categories.map(c => c.idCategorie))
      }
    } else {
      setNom('')
      setDescription('')
      setPrix('0.00')
      setStock(0)
      setSelectedCategories([])
    }
  }, [product])

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload = {
        nom,
        description,
        prix: parseFloat(prix),
        stock: parseInt(stock, 10),
        categories: selectedCategories.map(id => ({ idCategorie: id }))
      }
      await onSubmit(payload)
      if (!product) {
        setNom('')
        setDescription('')
        setPrix('0.00')
        setStock(0)
        setSelectedCategories([])
      }
    } catch (err) {
      alert(err.message || 'Erreur')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{display:'grid',gap:8}}>
      <label>
        Nom
        <input value={nom} onChange={e => setNom(e.target.value)} required />
      </label>
      <label>
        Description
        <textarea value={description} onChange={e => setDescription(e.target.value)} />
      </label>
      <label>
        Prix
        <input value={prix} onChange={e => setPrix(e.target.value)} type="number" step="0.01" required />
      </label>
      <label>
        Stock
        <input value={stock} onChange={e => setStock(e.target.value)} type="number" required />
      </label>
      
      <div>
        <label style={{marginBottom: 8}}>Catégories</label>
        {loadingCategories ? (
          <p style={{color: '#666', fontSize: '0.9em'}}>Chargement des catégories...</p>
        ) : categories.length > 0 ? (
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8}}>
            {categories.map(category => (
              <label key={category.idCategorie} style={{display: 'flex', alignItems: 'center', gap: 8}}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.idCategorie)}
                  onChange={() => handleCategoryChange(category.idCategorie)}
                />
                {category.nom}
              </label>
            ))}
          </div>
        ) : (
          <p style={{color: '#999', fontSize: '0.9em'}}>Aucune catégorie disponible</p>
        )}
      </div>

      <div>
        <button type="submit" disabled={submitting}>{submitting ? 'Enregistrement...' : 'Enregistrer'}</button>
        {onCancel && <button type="button" onClick={onCancel} style={{marginLeft:8}}>Annuler</button>}
      </div>
    </form>
  )
}
