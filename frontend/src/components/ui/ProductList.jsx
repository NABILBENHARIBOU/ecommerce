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
    <section style={{display:'grid',gridTemplateColumns:'repeat(3,minmax(220px,1fr))',gap:16}}>
      {products.map(p => (
        <ProductCard key={p.idProduit || p.id} product={p} />
      ))}
    </section>
  )
}


