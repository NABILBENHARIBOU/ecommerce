import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import api from '../../services/api'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    api.getAllProducts()
      .then(data => {
        if (mounted) setProducts(data || [])
      })
      .catch(err => {
        if (mounted) setError(err.message || 'Erreur lors du chargement des produits')
      })
      .finally(() => { if (mounted) setLoading(false) })

    return () => { mounted = false }
  }, [])

  if (loading) return <div>Chargement...</div>
  if (error) return <div style={{color:'red'}}>{error}</div>

  return (
    <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-2">
      {products.map(p => (
        <ProductCard key={p.idProduit || p.id} product={p} />
      ))}
    </section>
  )
}


